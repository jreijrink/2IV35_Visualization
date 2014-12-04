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