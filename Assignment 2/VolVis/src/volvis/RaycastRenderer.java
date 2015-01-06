/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package volvis;

import com.jogamp.opengl.util.texture.Texture;
import com.jogamp.opengl.util.texture.awt.AWTTextureIO;
import gui.RaycastRendererPanel;
import gui.TransferFunctionEditor;
import java.awt.image.BufferedImage;
import java.util.logging.Logger;
import javax.media.opengl.GL2;
import util.TFChangeListener;
import util.VectorMath;
import volume.Volume;
import volvis.TransferFunction.ControlPoint;

/**
 *
 * @author michel
 */
public class RaycastRenderer extends Renderer implements TFChangeListener {

    private Volume volume = null;
    RaycastRendererPanel panel;
    TransferFunction tFunc;
    TransferFunctionEditor tfEditor;
    private RenderMode _selectedRenderMode;
    private int _selectedStepSize;
    
    public enum RenderMode { MIP, Compositing, Opacity };
    
    public RaycastRenderer() {
        panel = new RaycastRendererPanel(this);
        panel.setSpeedLabel("0");
        
        SetStepSize(5);
        SetRenderMode(RenderMode.Opacity);
    }

    public void setVolume(Volume vol) {
        volume = vol;

        // set up image for storing the resulting rendering
        // the image width and height are equal to the length of the volume diagonal
        int imageSize = (int) Math.floor(Math.sqrt(vol.getDimX() * vol.getDimX() + vol.getDimY() * vol.getDimY()
                + vol.getDimZ() * vol.getDimZ()));
        if (imageSize % 2 != 0) {
            imageSize = imageSize + 1;
        }
        image = new BufferedImage(imageSize, imageSize, BufferedImage.TYPE_INT_ARGB);
        tFunc = new TransferFunction(volume.getMinimum(), volume.getMaximum());
        tFunc.addTFChangeListener(this);
        tfEditor = new TransferFunctionEditor(tFunc, volume.getHistogram());
        
        panel.setTransferFunctionEditor(tfEditor);
        
        tfEditor.setSelectedRenderMode(_selectedRenderMode);
        tfEditor.setSelectedStepSize(_selectedStepSize);
        tfEditor.setSelectedInfo(winWidth, winWidth, imageSize, null);
        
        panel.setTransferFunctionEditor(tfEditor);
    }

    @Override
    public void changed() {
        for (int i = 0; i < listeners.size(); i++) {
            listeners.get(i).changed();
        }
    }

    public void SetStepSize(int size)
    {
        _selectedStepSize = size;
    }
    
    public void SetRenderMode(RenderMode mode)
    {
        _selectedRenderMode = mode;
    }
    
    public RaycastRendererPanel getPanel() {
        return panel;
    }

    // get a voxel from the volume data by nearest neighbor interpolation
    short getVoxel(double[] coord) {

        int x = (int) Math.round(coord[0]);
        int y = (int) Math.round(coord[1]);
        int z = (int) Math.round(coord[2]);

        if ((x >= 0) && (x < volume.getDimX()) && (y >= 0) && (y < volume.getDimY()) && (z >= 0) && (z < volume.getDimZ())) {
            return volume.getVoxel(x, y, z);
        } else {
            return 0;
        }
    }
    
    // get a voxel from the volume data by tri-linear interpolation
    // http://en.wikipedia.org/wiki/Trilinear_interpolation
    short getTriVoxel(double[] coord) {

        int x0 = (int) Math.floor(coord[0]);
        int x1 = (int) Math.ceil(coord[0]);
        int y0 = (int) Math.floor(coord[1]);
        int y1 = (int) Math.ceil(coord[1]);
        int z0 = (int) Math.floor(coord[2]);
        int z1 = (int) Math.ceil(coord[2]);

        if ((x0 >= 0) && (x0 < volume.getDimX()) && (y0 >= 0) && (y0 < volume.getDimY()) && (z0 >= 0) && (z0 < volume.getDimZ()) &&
            (x1 >= 0) && (x1 < volume.getDimX()) && (y1 >= 0) && (y1 < volume.getDimY()) && (z1 >= 0) && (z1 < volume.getDimZ())) {
            double xd = (coord[0]-x0)/(x1-x0);
            double yd = (coord[1]-y0)/(y1-y0);
            double zd = (coord[2]-z0)/(z1-z0);
            
            if(Double.isNaN(xd) || Double.isNaN(yd) || Double.isNaN(zd))
            {
                return getVoxel(coord);
            
            }
            else
            {
                double c00 = volume.getVoxel(x0,y0,z0)*(1-xd) + volume.getVoxel(x1,y0,z0)*xd;
                double c10 = volume.getVoxel(x0,y1,z0)*(1-xd) + volume.getVoxel(x1,y1,z0)*xd;
                double c01 = volume.getVoxel(x0,y0,z1)*(1-xd) + volume.getVoxel(x1,y0,z1)*xd;
                double c11 = volume.getVoxel(x0,y1,z1)*(1-xd) + volume.getVoxel(x1,y1,z1)*xd;

                double c0 = c00*(1-yd) + c10*yd;
                double c1 = c01*(1-yd) + c11*yd;

                return (short)(c0*(1-zd) + c1*zd);
            }
        } else {
            return 0;
        }
    }
    
    double getVoxelGradient(double[] coord) {

        int x0 = (int) Math.floor(coord[0]);
        int x1 = (int) Math.ceil(coord[0]);
        int y0 = (int) Math.floor(coord[1]);
        int y1 = (int) Math.ceil(coord[1]);
        int z0 = (int) Math.floor(coord[2]);
        int z1 = (int) Math.ceil(coord[2]);

        if ((x0 >= 0) && (x0 < volume.getDimX()) && (y0 >= 0) && (y0 < volume.getDimY()) && (z0 >= 0) && (z0 < volume.getDimZ()) &&
            (x1 >= 0) && (x1 < volume.getDimX()) && (y1 >= 0) && (y1 < volume.getDimY()) && (z1 >= 0) && (z1 < volume.getDimZ())) {
            double xd = (coord[0]-x0)/(x1-x0);
            double yd = (coord[1]-y0)/(y1-y0);
            double zd = (coord[2]-z0)/(z1-z0);
            
            if(Double.isNaN(xd) || Double.isNaN(yd) || Double.isNaN(zd))
            {
                return getVoxel(coord);
            
            }
            else
            {
                double c00 = volume.getVoxel(x0,y0,z0)*(1-xd) + volume.getVoxel(x1,y0,z0)*xd;
                double c10 = volume.getVoxel(x0,y1,z0)*(1-xd) + volume.getVoxel(x1,y1,z0)*xd;
                double c01 = volume.getVoxel(x0,y0,z1)*(1-xd) + volume.getVoxel(x1,y0,z1)*xd;
                double c11 = volume.getVoxel(x0,y1,z1)*(1-xd) + volume.getVoxel(x1,y1,z1)*xd;
                
                double c0 = c00*(1-yd) + c10*yd;
                double c1 = c01*(1-yd) + c11*yd;
                
                double e0 = c00*(1-zd) + c01*zd;
                double e1 = c10*(1-zd) + c11*zd;
                
                double g00 = volume.getVoxel(x0,y0,z0)*(1-zd) + volume.getVoxel(x0,y0,z1)*zd;
                double g10 = volume.getVoxel(x1,y0,z0)*(1-zd) + volume.getVoxel(x1,y0,z1)*zd;
                double g01 = volume.getVoxel(x0,y1,z0)*(1-zd) + volume.getVoxel(x0,y1,z1)*zd;
                double g11 = volume.getVoxel(x1,y1,z0)*(1-zd) + volume.getVoxel(x1,y1,z1)*zd;
                
                double g0 = g00*(1-yd) + g01*yd;
                double g1 = g10*(1-yd) + g11*yd;
                
                
                double xdir = Math.abs(g0-g1);
                double ydir = Math.abs(e0-e1);
                double zdir = Math.abs(c0-c1);
                
                return (xdir + ydir + zdir);
            }
        } else {
            return 0;
        }
    }

    void slicer(double[] viewMatrix, boolean mouseEvent) {
        // clear image
         for (int j = 0; j < image.getHeight(); j++) {
            for (int i = 0; i < image.getWidth(); i++) {
                image.setRGB(i, j, 0);
            }
        }

        // vector uVec and vVec define a plane through the origin, 
        // perpendicular to the view vector viewVec
        double[] viewVec = new double[3];
        double[] uVec = new double[3];
        double[] vVec = new double[3];
        VectorMath.setVector(uVec, viewMatrix[0], viewMatrix[4], viewMatrix[8]);
        VectorMath.setVector(vVec, viewMatrix[1], viewMatrix[5], viewMatrix[9]);
        VectorMath.setVector(viewVec, viewMatrix[2], viewMatrix[6], viewMatrix[10]);

        // image is square
        int imageCenter = image.getWidth() / 2;

        double[] pixelCoord = new double[3];
        double[] volumeCenter = new double[3];
        VectorMath.setVector(volumeCenter, volume.getDimX() / 2, volume.getDimY() / 2, volume.getDimZ() / 2);

        // sample on a plane through the origin of the volume data
        double max = volume.getMaximum();
        int diagonal = image.getWidth() / 2;
        int step = mouseEvent ? 10 : _selectedStepSize;
        
        for (int j = 0; j < image.getHeight(); j++) {            
            //speed optimazation, calculate once per j iteration
            int jloc = j - imageCenter;
            double vLocX = vVec[0] * jloc;
            double vLocY = vVec[1] * jloc;
            double vLocZ = vVec[2] * jloc;
            
            for (int i = 0; i < image.getWidth(); i++) {                
                //speed optimazation, calculate once per i iteration
                int iloc = i - imageCenter;
                double uLocX = uVec[0] * iloc;
                double uLocY = uVec[1] * iloc;
                double uLocZ = uVec[2] * iloc;
                
                TFColor rayColor = new TFColor(0, 0, 0, 0);
                    
                if(_selectedRenderMode == RenderMode.MIP)
                {
                    int maxRay = 0;                
                    for (int k = -diagonal; k < diagonal; k += step) {
                        pixelCoord[0] = uLocX + vLocX + volumeCenter[0] + (k * viewVec[0]);
                        pixelCoord[1] = uLocY + vLocY + volumeCenter[1] + (k * viewVec[1]);
                        pixelCoord[2] = uLocZ + vLocZ + volumeCenter[2] + (k * viewVec[2]);

                        int val = getTriVoxel(pixelCoord);
                        maxRay = val > maxRay ? val : maxRay;
                        //speed optimazation
                        if(maxRay == max) break;
                    }
                    // Apply the transfer function to obtain a color
                    rayColor = tFunc.getColor(maxRay);
                }
                else if(_selectedRenderMode == RenderMode.Compositing)
                {
                    rayColor = new TFColor(1, 0, 0, 0);
                    double sumTransparency = 1;
                    
                    for (int k = -diagonal; k < diagonal; k += step) {
                        pixelCoord[0] = uLocX + vLocX + volumeCenter[0] + (k * viewVec[0]);
                        pixelCoord[1] = uLocY + vLocY + volumeCenter[1] + (k * viewVec[1]);
                        pixelCoord[2] = uLocZ + vLocZ + volumeCenter[2] + (k * viewVec[2]);

                        int voxel = getTriVoxel(pixelCoord);
                        TFColor voxelColor = new TFColor(0, 0, 0, 0);
                        if(voxel != 0)
                        {
                            voxelColor = tFunc.getColor(voxel);                 
                            double alpha = voxelColor.a;

                            TFColor newAddedColor = voxelColor.multiplyColor(alpha);
                            newAddedColor = newAddedColor.multiplyColor(sumTransparency);
                            rayColor = rayColor.addColors(newAddedColor);                    
                            sumTransparency = (1 - alpha) * sumTransparency;
                        }   
                    }
                }
                else if(_selectedRenderMode == RenderMode.Opacity)
                {
                    rayColor = new TFColor(1, 0, 0, 0);
                    double sumTransparency = 1;
                    
                    for (int k = -diagonal; k < diagonal; k += step) {
                        pixelCoord[0] = uLocX + vLocX + volumeCenter[0] + (k * viewVec[0]);
                        pixelCoord[1] = uLocY + vLocY + volumeCenter[1] + (k * viewVec[1]);
                        pixelCoord[2] = uLocZ + vLocZ + volumeCenter[2] + (k * viewVec[2]);

                        int voxel = getTriVoxel(pixelCoord);
                        double gradient = getVoxelGradient(pixelCoord);
                        double normal = gradient / max;
                        
                        TFColor voxelColor = new TFColor(0, 0, 0, 0);
                        if(voxel != 0)
                        {
                            ControlPoint leftVoxel = tFunc.getLeftControlPoint(voxel);
                            ControlPoint rightVoxel = tFunc.getRightControlPoint(voxel);
                            
                            double avl = leftVoxel.color.a;
                            double avr = rightVoxel.color.a;
                            int fvl = leftVoxel.value;
                            int fvr = rightVoxel.value;
                            
                            voxelColor = tFunc.getColor(voxel);                 
                            double alpha = normal * leftVoxel.color.a;
                            if (fvr != fvl) {
                                alpha = normal * (avr * ((double)(voxel - fvl)/(double)(fvr - fvl)))
                                    + (avl * ((double)(fvr - voxel)/(double)(fvr - fvl)));
                            }
                            

                            TFColor newAddedColor = voxelColor.multiplyColor(alpha);
                            newAddedColor = newAddedColor.multiplyColor(sumTransparency);
                            rayColor = rayColor.addColors(newAddedColor);                    
                            sumTransparency = (1 - alpha) * sumTransparency;
                        }   
                    }
                }
                    
                if(!rayColor.IsBlack())
                {
                    // BufferedImage expects a pixel color packed as ARGB in an int
                    int c_alpha = rayColor.a <= 1.0 ? (int) Math.floor(rayColor.a * 255) : 255;
                    int c_red = rayColor.r <= 1.0 ? (int) Math.floor(rayColor.r * 255) : 255;
                    int c_green = rayColor.g <= 1.0 ? (int) Math.floor(rayColor.g * 255) : 255;
                    int c_blue = rayColor.b <= 1.0 ? (int) Math.floor(rayColor.b * 255) : 255;
                    int pixelColor = (c_alpha << 24) | (c_red << 16) | (c_green << 8) | c_blue;
                    image.setRGB(i, j, pixelColor);
                }
            }
        }
    }

    private void drawBoundingBox(GL2 gl) {
        gl.glPushAttrib(GL2.GL_CURRENT_BIT);
        gl.glDisable(GL2.GL_LIGHTING);
        gl.glColor4d(1.0, 1.0, 1.0, 1.0);
        gl.glLineWidth(1.5f);
        gl.glEnable(GL2.GL_LINE_SMOOTH);
        gl.glHint(GL2.GL_LINE_SMOOTH_HINT, GL2.GL_NICEST);
        gl.glEnable(GL2.GL_BLEND);
        gl.glBlendFunc(GL2.GL_SRC_ALPHA, GL2.GL_ONE_MINUS_SRC_ALPHA);

        gl.glBegin(GL2.GL_LINE_LOOP);
        gl.glVertex3d(-volume.getDimX() / 2.0, -volume.getDimY() / 2.0, volume.getDimZ() / 2.0);
        gl.glVertex3d(-volume.getDimX() / 2.0, volume.getDimY() / 2.0, volume.getDimZ() / 2.0);
        gl.glVertex3d(volume.getDimX() / 2.0, volume.getDimY() / 2.0, volume.getDimZ() / 2.0);
        gl.glVertex3d(volume.getDimX() / 2.0, -volume.getDimY() / 2.0, volume.getDimZ() / 2.0);
        gl.glEnd();

        gl.glBegin(GL2.GL_LINE_LOOP);
        gl.glVertex3d(-volume.getDimX() / 2.0, -volume.getDimY() / 2.0, -volume.getDimZ() / 2.0);
        gl.glVertex3d(-volume.getDimX() / 2.0, volume.getDimY() / 2.0, -volume.getDimZ() / 2.0);
        gl.glVertex3d(volume.getDimX() / 2.0, volume.getDimY() / 2.0, -volume.getDimZ() / 2.0);
        gl.glVertex3d(volume.getDimX() / 2.0, -volume.getDimY() / 2.0, -volume.getDimZ() / 2.0);
        gl.glEnd();

        gl.glBegin(GL2.GL_LINE_LOOP);
        gl.glVertex3d(volume.getDimX() / 2.0, -volume.getDimY() / 2.0, -volume.getDimZ() / 2.0);
        gl.glVertex3d(volume.getDimX() / 2.0, -volume.getDimY() / 2.0, volume.getDimZ() / 2.0);
        gl.glVertex3d(volume.getDimX() / 2.0, volume.getDimY() / 2.0, volume.getDimZ() / 2.0);
        gl.glVertex3d(volume.getDimX() / 2.0, volume.getDimY() / 2.0, -volume.getDimZ() / 2.0);
        gl.glEnd();

        gl.glBegin(GL2.GL_LINE_LOOP);
        gl.glVertex3d(-volume.getDimX() / 2.0, -volume.getDimY() / 2.0, -volume.getDimZ() / 2.0);
        gl.glVertex3d(-volume.getDimX() / 2.0, -volume.getDimY() / 2.0, volume.getDimZ() / 2.0);
        gl.glVertex3d(-volume.getDimX() / 2.0, volume.getDimY() / 2.0, volume.getDimZ() / 2.0);
        gl.glVertex3d(-volume.getDimX() / 2.0, volume.getDimY() / 2.0, -volume.getDimZ() / 2.0);
        gl.glEnd();

        gl.glBegin(GL2.GL_LINE_LOOP);
        gl.glVertex3d(-volume.getDimX() / 2.0, volume.getDimY() / 2.0, -volume.getDimZ() / 2.0);
        gl.glVertex3d(-volume.getDimX() / 2.0, volume.getDimY() / 2.0, volume.getDimZ() / 2.0);
        gl.glVertex3d(volume.getDimX() / 2.0, volume.getDimY() / 2.0, volume.getDimZ() / 2.0);
        gl.glVertex3d(volume.getDimX() / 2.0, volume.getDimY() / 2.0, -volume.getDimZ() / 2.0);
        gl.glEnd();

        gl.glBegin(GL2.GL_LINE_LOOP);
        gl.glVertex3d(-volume.getDimX() / 2.0, -volume.getDimY() / 2.0, -volume.getDimZ() / 2.0);
        gl.glVertex3d(-volume.getDimX() / 2.0, -volume.getDimY() / 2.0, volume.getDimZ() / 2.0);
        gl.glVertex3d(volume.getDimX() / 2.0, -volume.getDimY() / 2.0, volume.getDimZ() / 2.0);
        gl.glVertex3d(volume.getDimX() / 2.0, -volume.getDimY() / 2.0, -volume.getDimZ() / 2.0);
        gl.glEnd();

        gl.glDisable(GL2.GL_LINE_SMOOTH);
        gl.glDisable(GL2.GL_BLEND);
        gl.glEnable(GL2.GL_LIGHTING);
        gl.glPopAttrib();

    }

    @Override
    public void visualize(GL2 gl, boolean mouseMove) {
        //System.out.println(mouseMove);
        
        if (volume == null) {
            return;
        }

        _selectedRenderMode = tfEditor.getSelectedRenderMode();
        _selectedStepSize = tfEditor.getSelectedStepSize();
        drawBoundingBox(gl);

        gl.glGetDoublev(GL2.GL_MODELVIEW_MATRIX, viewMatrix, 0);

        long startTime = System.currentTimeMillis();
        slicer(viewMatrix, mouseMove);
        long endTime = System.currentTimeMillis();
        double runningTime = (endTime - startTime);
        panel.setSpeedLabel(Double.toString(runningTime));

        Texture texture = AWTTextureIO.newTexture(gl.getGLProfile(), image, false);

        gl.glPushAttrib(GL2.GL_LIGHTING_BIT);
        gl.glDisable(GL2.GL_LIGHTING);
        gl.glEnable(GL2.GL_BLEND);
        gl.glBlendFunc(GL2.GL_SRC_ALPHA, GL2.GL_ONE_MINUS_SRC_ALPHA);

        // draw rendered image as a billboard texture
        texture.enable(gl);
        texture.bind(gl);
        double halfWidth = image.getWidth() / 2.0;
        gl.glPushMatrix();
        gl.glLoadIdentity();
        gl.glBegin(GL2.GL_QUADS);
        gl.glColor4f(1.0f, 1.0f, 1.0f, 1.0f);
        gl.glTexCoord2d(0.0, 0.0);
        gl.glVertex3d(-halfWidth, -halfWidth, 0.0);
        gl.glTexCoord2d(0.0, 1.0);
        gl.glVertex3d(-halfWidth, halfWidth, 0.0);
        gl.glTexCoord2d(1.0, 1.0);
        gl.glVertex3d(halfWidth, halfWidth, 0.0);
        gl.glTexCoord2d(1.0, 0.0);
        gl.glVertex3d(halfWidth, -halfWidth, 0.0);
        gl.glEnd();
        texture.disable(gl);
        texture.destroy(gl);
        gl.glPopMatrix();

        gl.glPopAttrib();


        if (gl.glGetError() > 0) {
            System.out.println("some OpenGL error: " + gl.glGetError());
        }

    }
    private BufferedImage image;
    private double[] viewMatrix = new double[4 * 4];
}
