"use strict";

var count = 0;
var TRACKBALLSIZE = 0.8;
var RENORMCOUNT = 97;

/*
 * Ok, simulate a track-ball.  Project the points onto the virtual
 * trackball, then figure out the axis of rotation, which is the cross
 * product of P1 P2 and O P1 (O is the center of the ball, 0,0,0)
 * Note:  This is a deformed trackball-- is a trackball in the center,
 * but is deformed into a hyperbolic sheet of rotation away from the
 * center.  This particular function was chosen after trying out
 * several variations.
 *
 * It is assumed that the arguments to this routine are in the range
 * (-1.0 ... 1.0)
 */

// all these vector functions are for vec3
//====================================================

function vzero()
{
    var v = [];
    v[0] = 0.0;
    v[1] = 0.0;
    v[2] = 0.0;
    return v;
}

function vset(x, y, z)
{
    var v = [];
    v[0] = x;
    v[1] = y;
    v[2] = z;
    return v;
}

function vsub(src1, src2)
{
    var dst = [];
    dst[0] = src1[0] - src2[0];
    dst[1] = src1[1] - src2[1];
    dst[2] = src1[2] - src2[2];
    return dst;
}

function vcopy(v1)
{
    var v2 = [];
    for (var i = 0 ; i < 3 ; i++)
        v2[i] = v1[i];
    return v2;
}

function vcross(v1, v2)
{
    var temp = [];
    temp[0] = (v1[1] * v2[2]) - (v1[2] * v2[1]);
    temp[1] = (v1[2] * v2[0]) - (v1[0] * v2[2]);
    temp[2] = (v1[0] * v2[1]) - (v1[1] * v2[0]);
    return temp;
}

function vlength(v)
{
    return Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
}

function vscale(v1, div)
{
    var v2 = [];
    v2[0] = v1[0] * div;
    v2[1] = v1[1] * div;
    v2[2] = v1[2] * div;
    return v2;
}

function vnormal(v)
{
    return vscale(v, 1.0/vlength(v));
}

function vdot(v1, v2)
{
    return v1[0]*v2[0] + v1[1]*v2[1] + v1[2]*v2[2];
}

function vadd(src1, src2)
{
    var dst = [];
    dst[0] = src1[0] + src2[0];
    dst[1] = src1[1] + src2[1];
    dst[2] = src1[2] + src2[2];
    return dst;
}

//====================================================

function
trackball(p1x, p1y, p2x, p2y)
{
    var a = []; /* Axis of rotation */
    var phi;  /* how much to rotate about axis */
    var p1 = [];
    var p2 = [];
    var d = [];
    var t;
    var q = [];
    
    if (p1x == p2x && p1y == p2y) {
        /* Zero rotation */
        q = vzero();
        q[3] = 1.0;
        return q;
    }
    
    /*
     * First, figure out z-coordinates for projection of P1 and P2 to
     * deformed sphere
     */
    p1 = vset(p1x, p1y, tb_project_to_sphere(TRACKBALLSIZE,p1x,p1y));
    p2 = vset(p2x, p2y, tb_project_to_sphere(TRACKBALLSIZE,p2x,p2y));
    
    /*
     *  Now, we want the cross product of P1 and P2
     */
    a = vcross(p2,p1);
    
    /*
     *  Figure out how much to rotate around that axis.
     */
    d = vsub(p1,p2);
    t = vlength(d) / (2.0*TRACKBALLSIZE);
    
    /*
     * Avoid problems with out-of-control values...
     */
    if (t > 1.0) t = 1.0;
    if (t < -1.0) t = -1.0;
    phi = 2.0 * Math.asin(t);

    // Given an axis and angle, compute quaternion.
    a = vnormal(a);
    q = vscale(a, Math.sin(phi/2.0));
    q[3] = Math.cos(phi/2.0);
    return q;
}

/*
 * Project an x,y pair onto a sphere of radius r OR a hyperbolic sheet
 * if we are away from the center of the sphere.
 */
function
tb_project_to_sphere(r, x, y)
{
    var d, t, z;
    
    d = Math.sqrt(x*x + y*y);
    if (d < r * 0.70710678118654752440) {    /* Inside sphere */
        z = Math.sqrt(r*r - d*d);
    } else {           /* On hyperbola */
        t = r / 1.41421356237309504880;
        z = t*t / d;
    }
    return z;
}

/*
 * Given two rotations, e1 and e2, expressed as quaternion rotations,
 * figure out the equivalent single rotation and stuff it into dest.
 *
 * This routine also normalizes the result every RENORMCOUNT times it is
 * called, to keep error from creeping in.
 *
 * NOTE: This routine is written so that q1 or q2 may be the same
 * as dest (or each other).
 */

function
add_quats(q1, q2)
{
    var t1 = [], t2 = [], t3 = [], tf = [];
    var dest = [];
    
    t1[0] = q1[0];
    t1[1] = q1[1];
    t1[2] = q1[2];
    
    t1 = vscale(t1, q2[3]);
    
    t2[0] = q2[0];
    t2[1] = q2[1];
    t2[2] = q2[2];

    t2 = vscale(t2, q1[3]);
    
    t3 = vcross(q2,q1);
    tf = vadd(t1, t2);
    tf = vadd(t3, tf);
    tf[3] = q1[3] * q2[3] - vdot(q1,q2);
    
    dest[0] = tf[0];
    dest[1] = tf[1];
    dest[2] = tf[2];
    dest[3] = tf[3];
    
    if (++count > RENORMCOUNT) {
        count = 0;
        dest = normalize_quat(dest);
    }
    return dest;
}

/*
 * Quaternions always obey:  a^2 + b^2 + c^2 + d^2 = 1.0
 * If they don't add up to 1.0, dividing by their magnitued will
 * renormalize them.
 *
 * Note: See the following for more information on quaternions:
 *
 * - Shoemake, K., Animating rotation with quaternion curves, Computer
 *   Graphics 19, No 3 (Proc. SIGGRAPH'85), 245-254, 1985.
 * - Pletinckx, D., Quaternion calculus as a basic tool in computer
 *   graphics, The Visual Computer 5, 2-13, 1989.
 */

function
normalize_quat(q)
{
    var v = [];
    var i, mag;
    
    mag = Math.sqrt(q[0]*q[0] + q[1]*q[1] + q[2]*q[2] + q[3]*q[3]);
    for (i = 0; i < 4; i++) q[i] /= mag;
    v[0] = q[0];
    v[1] = q[1];
    v[2] = q[2];
    v[3] = q[3];
    return v;
}

/*
 * Build a rotation matrix, given a quaternion rotation.
 *
 */
function
build_rotmatrix(q)
{
    var m = mat4();
    
    // m are stored in column major
    m[0][0] = 1.0 - 2.0 * (q[1] * q[1] + q[2] * q[2]);
    m[0][1] = 2.0 * (q[0] * q[1] - q[2] * q[3]);
    m[0][2] = 2.0 * (q[2] * q[0] + q[1] * q[3]);
    m[0][3] = 0.0;
    
    m[1][0] = 2.0 * (q[0] * q[1] + q[2] * q[3]);
    m[1][1]= 1.0 - 2.0 * (q[2] * q[2] + q[0] * q[0]);
    m[1][2] = 2.0 * (q[1] * q[2] - q[0] * q[3]);
    m[1][3] = 0.0;
    
    m[2][0] = 2.0 * (q[2] * q[0] - q[1] * q[3]);
    m[2][1] = 2.0 * (q[1] * q[2] + q[0] * q[3]);
    m[2][2] = 1.0 - 2.0 * (q[1] * q[1] + q[0] * q[0]);
    m[2][3] = 0.0;
    
    m[3][0] = 0.0;
    m[3][1] = 0.0;
    m[3][2] = 0.0;
    m[3][3] = 1.0;
    
    // transpose m to row major
    return transpose(m);
}
