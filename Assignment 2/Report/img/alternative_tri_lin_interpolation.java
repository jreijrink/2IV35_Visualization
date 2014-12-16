return (short)(
volume.getVoxel(x0,y0,z0)*(1-xd)*(1-yd)*(1-zd) +
volume.getVoxel(x1,y0,z0)*xd*(1-yd)*(1-zd) +
volume.getVoxel(x0,y1,z0)*(1-xd)*yd*(1-zd) +
volume.getVoxel(x0,y0,z1)*(1-xd)*(1-yd)*zd +
volume.getVoxel(x1,y1,z0)*xd*yd*(1-zd) +
volume.getVoxel(x0,y1,z1)*(1-xd)*yd*zd +
volume.getVoxel(x1,y0,z1)*xd*(1-yd)*zd +
volume.getVoxel(x1,y1,z1)*xd*yd*zd
);

//simplify equation:
...?

return (short)(
volume.getVoxel(x0,y0,z0)*(1-xd)*(1-yd)*(1-zd) +
volume.getVoxel(x1,y0,z0)*xd*(1-yd)*(1-zd) +
volume.getVoxel(x0,y1,z0)*(1-xd)*yd*(1-zd) +
volume.getVoxel(x0,y0,z1)*(1-xd)*(1-yd)*zd +
volume.getVoxel(x1,y1,z0)*xd*yd*(1-zd) +
volume.getVoxel(x0,y1,z1)*(1-xd)*yd*zd +
volume.getVoxel(x1,y0,z1)*xd*(1-yd)*zd +
volume.getVoxel(x1,y1,z1)*xd*yd*zd
);







return (short)(
v_1*(1-xd)*(1-yd)*(1-zd) +
v_2*xd*(1-yd)*(1-zd) +
v_5*(1-xd)*yd*(1-zd) +
v_3*(1-xd)*(1-yd)*zd +
v_6*xd*yd*(1-zd) +
v_7*(1-xd)*yd*zd +
v_4*xd*(1-yd)*zd +
v_8*xd*yd*zd
);