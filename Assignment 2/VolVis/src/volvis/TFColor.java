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
    
    public TFColor(double red, double green, double blue, double alpha) {
        r = red;
        g = green;
        b = blue;
        a = alpha;
    }
    
    @Override
    public String toString() {
        String text = "(" + r + ", " + g + ", " + b + ", " + a + ")";
        return text;
    }
    
    public void add(TFColor c) {
        this.a += c.a;
        this.r += c.r;
        this.g += c.g;
        this.b += c.b;
    }
    
    public void multiply(double i) {
        this.a *= i;
        this.r *= i;
        this.g *= i;
        this.b *= i;
    }
    
}
