/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package gui;

import java.awt.BorderLayout;
import java.awt.Color;
import javax.swing.JColorChooser;
import volvis.RaycastRenderer;
import volvis.TFColor;
import volvis.TransferFunction;
import javax.swing.JSlider;
import javax.swing.ButtonGroup;

/**
 *
 * @author michel
 */
public class TransferFunctionEditor extends javax.swing.JPanel {

    private TransferFunction tfunc;
    private TransferFunctionView tfView;
    private int selected;
    private int stepSize;
    private RaycastRenderer.RenderMode rendermode;
    /**
     * Creates new form TransferFunctionEditor
     */
    public TransferFunctionEditor(TransferFunction tfunc, int[] histogram) {
        initComponents();

        this.tfunc = tfunc;
        this.tfView = new TransferFunctionView(tfunc, histogram, this);
        histogramPanel.setLayout(new BorderLayout());
        histogramPanel.add(tfView, BorderLayout.CENTER);
        
        ButtonGroup group = new ButtonGroup();        
        group.add(this.jRadioButtonCom);
        group.add(this.jRadioButtonMIP);

    }

    public void setSelectedInfo(int idx, int s, double a, TFColor c) {
        selected = idx;
        scalarTextField.setText(Integer.toString(s));
        opacityTextField.setText(String.format("%.2f", a));
        if(c != null)
            colorButton.setBackground(new Color((float) c.r, (float) c.g, (float) c.b));
    }

    /**
     * This method is called from within the constructor to initialize the form.
     * WARNING: Do NOT modify this code. The content of this method is always
     * regenerated by the Form Editor.
     */
    @SuppressWarnings("unchecked")
    // <editor-fold defaultstate="collapsed" desc="Generated Code">//GEN-BEGIN:initComponents
    private void initComponents() {

        histogramPanel = new javax.swing.JPanel();
        jLabel1 = new javax.swing.JLabel();
        jLabel2 = new javax.swing.JLabel();
        scalarTextField = new javax.swing.JTextField();
        opacityTextField = new javax.swing.JTextField();
        jLabel4 = new javax.swing.JLabel();
        colorButton = new javax.swing.JButton();
        jPanel1 = new javax.swing.JPanel();
        jLabel5 = new javax.swing.JLabel();
        jLabel6 = new javax.swing.JLabel();
        jLabel7 = new javax.swing.JLabel();
        jLabel8 = new javax.swing.JLabel();
        jLabel11 = new javax.swing.JLabel();
        jPanel2 = new javax.swing.JPanel();
        jRadioButtonMIP = new javax.swing.JRadioButton();
        jRadioButtonCom = new javax.swing.JRadioButton();
        jSliderStep = new javax.swing.JSlider();

        org.jdesktop.layout.GroupLayout histogramPanelLayout = new org.jdesktop.layout.GroupLayout(histogramPanel);
        histogramPanel.setLayout(histogramPanelLayout);
        histogramPanelLayout.setHorizontalGroup(
            histogramPanelLayout.createParallelGroup(org.jdesktop.layout.GroupLayout.LEADING)
            .add(0, 0, Short.MAX_VALUE)
        );
        histogramPanelLayout.setVerticalGroup(
            histogramPanelLayout.createParallelGroup(org.jdesktop.layout.GroupLayout.LEADING)
            .add(0, 254, Short.MAX_VALUE)
        );

        jLabel1.setText("Scalar value");

        jLabel2.setText("Opacity");

        scalarTextField.setEditable(false);
        scalarTextField.setHorizontalAlignment(javax.swing.JTextField.RIGHT);
        scalarTextField.setFocusable(false);
        scalarTextField.setMaximumSize(new java.awt.Dimension(84, 28));
        scalarTextField.setMinimumSize(new java.awt.Dimension(84, 28));

        opacityTextField.setEditable(false);
        opacityTextField.setHorizontalAlignment(javax.swing.JTextField.RIGHT);
        opacityTextField.setToolTipText("");
        opacityTextField.setFocusable(false);
        opacityTextField.setMaximumSize(new java.awt.Dimension(84, 28));
        opacityTextField.setMinimumSize(new java.awt.Dimension(84, 28));

        jLabel4.setText("Opacity");

        colorButton.setText("    ");
        colorButton.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                colorButtonActionPerformed(evt);
            }
        });

        org.jdesktop.layout.GroupLayout jPanel1Layout = new org.jdesktop.layout.GroupLayout(jPanel1);
        jPanel1.setLayout(jPanel1Layout);
        jPanel1Layout.setHorizontalGroup(
            jPanel1Layout.createParallelGroup(org.jdesktop.layout.GroupLayout.LEADING)
            .add(0, 180, Short.MAX_VALUE)
        );
        jPanel1Layout.setVerticalGroup(
            jPanel1Layout.createParallelGroup(org.jdesktop.layout.GroupLayout.LEADING)
            .add(0, 190, Short.MAX_VALUE)
        );

        jLabel5.setHorizontalAlignment(javax.swing.SwingConstants.CENTER);
        jLabel5.setText("<html>Scalar value &rarr;</html>");

        jLabel6.setText("<html>&uarr;</html>");

        jLabel7.setText("Color");

        jLabel8.setText("Step");

        jLabel11.setText("Renderer");

        jRadioButtonMIP.setText("MIP");
        jRadioButtonMIP.setHideActionText(true);
        jRadioButtonMIP.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                MIPRendererSelected(evt);
            }
        });

        jRadioButtonCom.setSelected(true);
        jRadioButtonCom.setText("Compositing");
        jRadioButtonCom.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                CompositingRendererSelected(evt);
            }
        });

        org.jdesktop.layout.GroupLayout jPanel2Layout = new org.jdesktop.layout.GroupLayout(jPanel2);
        jPanel2.setLayout(jPanel2Layout);
        jPanel2Layout.setHorizontalGroup(
            jPanel2Layout.createParallelGroup(org.jdesktop.layout.GroupLayout.LEADING)
            .add(jPanel2Layout.createSequentialGroup()
                .add(0, 0, Short.MAX_VALUE)
                .add(jPanel2Layout.createParallelGroup(org.jdesktop.layout.GroupLayout.LEADING, false)
                    .add(jRadioButtonCom, org.jdesktop.layout.GroupLayout.DEFAULT_SIZE, org.jdesktop.layout.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                    .add(jRadioButtonMIP, org.jdesktop.layout.GroupLayout.DEFAULT_SIZE, org.jdesktop.layout.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)))
        );
        jPanel2Layout.setVerticalGroup(
            jPanel2Layout.createParallelGroup(org.jdesktop.layout.GroupLayout.LEADING)
            .add(jPanel2Layout.createSequentialGroup()
                .add(jRadioButtonMIP)
                .addPreferredGap(org.jdesktop.layout.LayoutStyle.UNRELATED)
                .add(jRadioButtonCom)
                .addContainerGap(org.jdesktop.layout.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE))
        );

        jSliderStep.setMaximum(10);
        jSliderStep.setMinimum(1);
        jSliderStep.setValue(5);
        jSliderStep.addChangeListener(new javax.swing.event.ChangeListener() {
            public void stateChanged(javax.swing.event.ChangeEvent evt) {
                stepSliderChanged(evt);
            }
        });

        org.jdesktop.layout.GroupLayout layout = new org.jdesktop.layout.GroupLayout(this);
        this.setLayout(layout);
        layout.setHorizontalGroup(
            layout.createParallelGroup(org.jdesktop.layout.GroupLayout.LEADING)
            .add(layout.createSequentialGroup()
                .addContainerGap()
                .add(layout.createParallelGroup(org.jdesktop.layout.GroupLayout.LEADING)
                    .add(layout.createSequentialGroup()
                        .add(layout.createParallelGroup(org.jdesktop.layout.GroupLayout.TRAILING)
                            .add(jLabel4)
                            .add(jLabel6, org.jdesktop.layout.GroupLayout.PREFERRED_SIZE, org.jdesktop.layout.GroupLayout.DEFAULT_SIZE, org.jdesktop.layout.GroupLayout.PREFERRED_SIZE))
                        .addPreferredGap(org.jdesktop.layout.LayoutStyle.RELATED)
                        .add(layout.createParallelGroup(org.jdesktop.layout.GroupLayout.LEADING)
                            .add(histogramPanel, org.jdesktop.layout.GroupLayout.DEFAULT_SIZE, org.jdesktop.layout.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                            .add(layout.createSequentialGroup()
                                .add(6, 6, 6)
                                .add(jLabel5)
                                .addContainerGap())))
                    .add(layout.createSequentialGroup()
                        .add(layout.createParallelGroup(org.jdesktop.layout.GroupLayout.LEADING)
                            .add(layout.createParallelGroup(org.jdesktop.layout.GroupLayout.LEADING)
                                .add(jLabel1)
                                .add(org.jdesktop.layout.GroupLayout.TRAILING, jLabel2, org.jdesktop.layout.GroupLayout.PREFERRED_SIZE, 74, org.jdesktop.layout.GroupLayout.PREFERRED_SIZE))
                            .add(jLabel7, org.jdesktop.layout.GroupLayout.PREFERRED_SIZE, 74, org.jdesktop.layout.GroupLayout.PREFERRED_SIZE)
                            .add(jLabel8, org.jdesktop.layout.GroupLayout.PREFERRED_SIZE, 74, org.jdesktop.layout.GroupLayout.PREFERRED_SIZE)
                            .add(jLabel11, org.jdesktop.layout.GroupLayout.PREFERRED_SIZE, 74, org.jdesktop.layout.GroupLayout.PREFERRED_SIZE))
                        .add(165, 165, 165)
                        .add(layout.createParallelGroup(org.jdesktop.layout.GroupLayout.LEADING, false)
                            .add(scalarTextField, org.jdesktop.layout.GroupLayout.DEFAULT_SIZE, org.jdesktop.layout.GroupLayout.DEFAULT_SIZE, org.jdesktop.layout.GroupLayout.PREFERRED_SIZE)
                            .add(org.jdesktop.layout.GroupLayout.TRAILING, colorButton, org.jdesktop.layout.GroupLayout.DEFAULT_SIZE, org.jdesktop.layout.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                            .add(org.jdesktop.layout.GroupLayout.TRAILING, opacityTextField, org.jdesktop.layout.GroupLayout.DEFAULT_SIZE, org.jdesktop.layout.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                            .add(jPanel2, org.jdesktop.layout.GroupLayout.DEFAULT_SIZE, org.jdesktop.layout.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                            .add(jSliderStep, org.jdesktop.layout.GroupLayout.PREFERRED_SIZE, 0, Short.MAX_VALUE))
                        .addPreferredGap(org.jdesktop.layout.LayoutStyle.RELATED, 108, Short.MAX_VALUE)
                        .add(jPanel1, org.jdesktop.layout.GroupLayout.DEFAULT_SIZE, org.jdesktop.layout.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                        .addContainerGap())))
        );
        layout.setVerticalGroup(
            layout.createParallelGroup(org.jdesktop.layout.GroupLayout.LEADING)
            .add(layout.createSequentialGroup()
                .add(layout.createParallelGroup(org.jdesktop.layout.GroupLayout.LEADING)
                    .add(histogramPanel, org.jdesktop.layout.GroupLayout.PREFERRED_SIZE, org.jdesktop.layout.GroupLayout.DEFAULT_SIZE, org.jdesktop.layout.GroupLayout.PREFERRED_SIZE)
                    .add(layout.createSequentialGroup()
                        .addContainerGap()
                        .add(jLabel6, org.jdesktop.layout.GroupLayout.PREFERRED_SIZE, org.jdesktop.layout.GroupLayout.DEFAULT_SIZE, org.jdesktop.layout.GroupLayout.PREFERRED_SIZE)
                        .add(5, 5, 5)
                        .add(jLabel4)))
                .addPreferredGap(org.jdesktop.layout.LayoutStyle.RELATED)
                .add(jLabel5, org.jdesktop.layout.GroupLayout.PREFERRED_SIZE, org.jdesktop.layout.GroupLayout.DEFAULT_SIZE, org.jdesktop.layout.GroupLayout.PREFERRED_SIZE)
                .addPreferredGap(org.jdesktop.layout.LayoutStyle.RELATED)
                .add(layout.createParallelGroup(org.jdesktop.layout.GroupLayout.LEADING)
                    .add(layout.createSequentialGroup()
                        .add(layout.createParallelGroup(org.jdesktop.layout.GroupLayout.BASELINE)
                            .add(jLabel1)
                            .add(scalarTextField, org.jdesktop.layout.GroupLayout.DEFAULT_SIZE, org.jdesktop.layout.GroupLayout.DEFAULT_SIZE, org.jdesktop.layout.GroupLayout.PREFERRED_SIZE))
                        .addPreferredGap(org.jdesktop.layout.LayoutStyle.RELATED)
                        .add(layout.createParallelGroup(org.jdesktop.layout.GroupLayout.BASELINE)
                            .add(jLabel2)
                            .add(opacityTextField, org.jdesktop.layout.GroupLayout.PREFERRED_SIZE, org.jdesktop.layout.GroupLayout.DEFAULT_SIZE, org.jdesktop.layout.GroupLayout.PREFERRED_SIZE))
                        .addPreferredGap(org.jdesktop.layout.LayoutStyle.RELATED)
                        .add(layout.createParallelGroup(org.jdesktop.layout.GroupLayout.BASELINE)
                            .add(jLabel7, org.jdesktop.layout.GroupLayout.PREFERRED_SIZE, 22, org.jdesktop.layout.GroupLayout.PREFERRED_SIZE)
                            .add(colorButton))
                        .addPreferredGap(org.jdesktop.layout.LayoutStyle.RELATED)
                        .add(layout.createParallelGroup(org.jdesktop.layout.GroupLayout.LEADING)
                            .add(jLabel11, org.jdesktop.layout.GroupLayout.PREFERRED_SIZE, 22, org.jdesktop.layout.GroupLayout.PREFERRED_SIZE)
                            .add(layout.createSequentialGroup()
                                .add(1, 1, 1)
                                .add(jPanel2, org.jdesktop.layout.GroupLayout.PREFERRED_SIZE, org.jdesktop.layout.GroupLayout.DEFAULT_SIZE, org.jdesktop.layout.GroupLayout.PREFERRED_SIZE)))
                        .addPreferredGap(org.jdesktop.layout.LayoutStyle.RELATED)
                        .add(layout.createParallelGroup(org.jdesktop.layout.GroupLayout.LEADING)
                            .add(jLabel8, org.jdesktop.layout.GroupLayout.PREFERRED_SIZE, 22, org.jdesktop.layout.GroupLayout.PREFERRED_SIZE)
                            .add(jSliderStep, org.jdesktop.layout.GroupLayout.PREFERRED_SIZE, org.jdesktop.layout.GroupLayout.DEFAULT_SIZE, org.jdesktop.layout.GroupLayout.PREFERRED_SIZE))
                        .add(0, 0, Short.MAX_VALUE))
                    .add(layout.createSequentialGroup()
                        .add(jPanel1, org.jdesktop.layout.GroupLayout.DEFAULT_SIZE, org.jdesktop.layout.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                        .addContainerGap())))
        );

        jLabel11.getAccessibleContext().setAccessibleName("1");
    }// </editor-fold>//GEN-END:initComponents

    private void colorButtonActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_colorButtonActionPerformed

        Color newColor = JColorChooser.showDialog(this, "Choose color", colorButton.getBackground());
        if (newColor != null) {
            colorButton.setBackground(newColor);
            tfunc.updateControlPointColor(selected, newColor);
            tfunc.changed();
            tfView.repaint();
        }
    }//GEN-LAST:event_colorButtonActionPerformed

    public RaycastRenderer.RenderMode getSelectedRenderMode()
    {
        return rendermode;       
    }
    
    public int getSelectedStepSize()
    {
        return stepSize;
    }
    
    public void setSelectedRenderMode(RaycastRenderer.RenderMode mode)
    {
        if(mode == RaycastRenderer.RenderMode.Compsiting)
        {
            this.jRadioButtonCom.setSelected(true);
            this.jRadioButtonMIP.setSelected(false);
        }
        else if(mode == RaycastRenderer.RenderMode.MIP)
        {
            this.jRadioButtonCom.setSelected(false);
            this.jRadioButtonMIP.setSelected(true);
        }
        rendermode = mode;
    }
    
    public void setSelectedStepSize(int size)
    {
        this.jSliderStep.setValue((size % 10) + 1);
        stepSize = size;
    }
    
    private void MIPRendererSelected(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_MIPRendererSelected
        rendermode = RaycastRenderer.RenderMode.MIP;
        tfunc.changed();
    }//GEN-LAST:event_MIPRendererSelected

    private void CompositingRendererSelected(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_CompositingRendererSelected
        rendermode = RaycastRenderer.RenderMode.Compsiting;
        tfunc.changed();
    }//GEN-LAST:event_CompositingRendererSelected

    private void stepSliderChanged(javax.swing.event.ChangeEvent evt) {//GEN-FIRST:event_stepSliderChanged
        JSlider source = (JSlider)evt.getSource();
        if(!source.getValueIsAdjusting())
        {
            stepSize = source.getValue();
            tfunc.changed();
        }
    }//GEN-LAST:event_stepSliderChanged

    // Variables declaration - do not modify//GEN-BEGIN:variables
    private javax.swing.JButton colorButton;
    private javax.swing.JPanel histogramPanel;
    private javax.swing.JLabel jLabel1;
    private javax.swing.JLabel jLabel11;
    private javax.swing.JLabel jLabel2;
    private javax.swing.JLabel jLabel4;
    private javax.swing.JLabel jLabel5;
    private javax.swing.JLabel jLabel6;
    private javax.swing.JLabel jLabel7;
    private javax.swing.JLabel jLabel8;
    private javax.swing.JPanel jPanel1;
    private javax.swing.JPanel jPanel2;
    private javax.swing.JRadioButton jRadioButtonCom;
    private javax.swing.JRadioButton jRadioButtonMIP;
    private javax.swing.JSlider jSliderStep;
    private javax.swing.JTextField opacityTextField;
    private javax.swing.JTextField scalarTextField;
    // End of variables declaration//GEN-END:variables
}
