/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package volvis;

/**
 *
 * @author michel
 */
public class TFColor {
    public double r, g, b, a;

    public TFColor() {
        r = g = b = a = 1.0;
    }
    
    public TFColor(double alpha, double red, double green, double blue) {
        a = alpha;
        r = red;
        g = green;
        b = blue;
    }
    
    @Override
    public String toString() {
        String text = "(" + r + ", " + g + ", " + b + ", " + a + ")";
        return text;
    }
    
    public TFColor addColors(TFColor c) {
        TFColor addColor = new TFColor(a, r, g, b);
        addColor.r += c.r;
        addColor.g += c.g;
        addColor.b += c.b;
        return addColor;
    }
    
    public TFColor addColorsComplex(TFColor c) {
        TFColor addColor = new TFColor(a, r, g, b);
        double newAlpha = addColor.a + c.a * (1-addColor.a);        
        this.r = (addColor.r * addColor.a + c.r * c.a * (1-addColor.a)) / newAlpha;
        this.g = (addColor.g * addColor.a + c.g * c.a * (1-addColor.a)) / newAlpha;
        this.b = (addColor.b * addColor.a + c.b * c.a * (1-addColor.a)) / newAlpha;
        this.a = newAlpha;
        return addColor;
    }
    
    public TFColor multiplyColor(double i) {
        TFColor multiplyColor = new TFColor(a, r, g, b);
        multiplyColor.r *= i;
        multiplyColor.g *= i;
        multiplyColor.b *= i;
        return multiplyColor;
    }    
    public TFColor multiplyAlpha(double i) {
        TFColor multiplyColor = new TFColor(a, r, g, b);
        multiplyColor.a *= i;
        return multiplyColor;
    }
}
