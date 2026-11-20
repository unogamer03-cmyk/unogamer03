# Test 3D logo "بوابة | BAWABA" — pointed-arch gateway mark.
# Usage: blender -b --python logo.py -- <out.png> <res> <samples>
import bpy, math, sys, os
from mathutils import Vector

argv = sys.argv[sys.argv.index("--")+1:] if "--" in sys.argv else []
OUT = argv[0] if argv else "/tmp/logo.png"
RES = int(argv[1]) if len(argv) > 1 else 1080
SAMPLES = int(argv[2]) if len(argv) > 2 else 160
ENGINE = os.environ.get("ENGINE", "CYCLES")          # CYCLES | EEVEE
TURN = int(os.environ.get("TURNTABLE_FRAMES", "0"))  # >0 = render an N-frame 360° loop

bpy.ops.wm.read_factory_settings(use_empty=True)
sc = bpy.context.scene

# ---------- helpers ----------
def mat(name, color, metal=0.0, rough=0.5, emit=None, strength=0.0, aniso=0.0):
    m = bpy.data.materials.new(name); m.use_nodes = True
    b = m.node_tree.nodes["Principled BSDF"]
    b.inputs["Base Color"].default_value = (*color, 1)
    b.inputs["Metallic"].default_value = metal
    b.inputs["Roughness"].default_value = rough
    if "Anisotropic" in b.inputs: b.inputs["Anisotropic"].default_value = aniso
    if emit:
        b.inputs["Emission Color"].default_value = (*emit, 1)
        b.inputs["Emission Strength"].default_value = strength
    return m

def arch_pts(w, h_rect, r_scale=1.0, n=40, y0=0.0):
    """Pointed (equilateral-ish) arch outline, counter-clockwise, base at y0."""
    hw = w/2; r = w*r_scale
    pts = [(-hw, y0), (hw, y0), (hw, y0+h_rect)]
    # right arc: centre at (-hw + (r - w) ... ) -> centre at x = hw - r
    cx_r = hw - r
    apex_dy = math.sqrt(r*r - (r-hw)**2)
    a0 = 0.0; a1 = math.atan2(apex_dy, -cx_r)  # angle to apex from right centre
    for i in range(1, n):
        a = a0 + (a1-a0)*i/n
        pts.append((cx_r + r*math.cos(a), y0+h_rect + r*math.sin(a)))
    pts.append((0, y0+h_rect+apex_dy))
    cx_l = -hw + r
    b0 = math.pi - a1; b1 = math.pi
    for i in range(1, n):
        a = b0 + (b1-b0)*i/n
        pts.append((cx_l + r*math.cos(a), y0+h_rect + r*math.sin(a)))
    pts.append((-hw, y0+h_rect))
    return pts

def add_poly(cu, pts):
    sp = cu.splines.new('POLY'); sp.points.add(len(pts)-1)
    for p, (x, y) in zip(sp.points, pts): p.co = (x, y, 0, 1)
    sp.use_cyclic_u = True

def curve_obj(name, splines, extrude, bevel, material):
    cu = bpy.data.curves.new(name, 'CURVE'); cu.dimensions = '2D'; cu.fill_mode = 'BOTH'
    for s in splines: add_poly(cu, s)
    cu.extrude = extrude; cu.bevel_depth = bevel; cu.bevel_resolution = 4
    ob = bpy.data.objects.new(name, cu); sc.collection.objects.link(ob)
    ob.data.materials.append(material)
    return ob

# ---------- materials ----------
GOLD  = mat("Gold", (0.90, 0.55, 0.20), metal=1.0, rough=0.22, aniso=0.4)
TEAL  = mat("DeepTeal", (0.010, 0.060, 0.065), metal=0.0, rough=0.35)
SUN   = mat("Sun", (1.0, 0.45, 0.15), emit=(1.0, 0.42, 0.12), strength=2.2)
STAGE = mat("Stage", (0.010, 0.017, 0.020), rough=0.7)

# ---------- mark ----------
# Outer gateway: thick arch frame (outer arch with inner arch hole)
outer = arch_pts(1.00, 0.55, 1.0, y0=0.0)
inner = arch_pts(0.70, 0.55, 1.0, y0=0.0)
inner = [(x, y + 0.0) for x, y in inner]
frame = curve_obj("Frame", [outer, inner], 0.16, 0.025, GOLD)

# Recessed panel inside the gateway
panel = curve_obj("Panel", [arch_pts(0.70, 0.55, 1.0)], 0.04, 0.0, TEAL)
panel.location.z = -0.12

# Rising sun inside the arch — half sunk under the threshold
bpy.ops.mesh.primitive_uv_sphere_add(radius=0.19, location=(0, 0.30, -0.04), segments=96, ring_count=48)
sun = bpy.context.object; sun.data.materials.append(SUN); bpy.ops.object.shade_smooth()

# Threshold step
bpy.ops.mesh.primitive_cube_add(location=(0, -0.06, 0.0))
step = bpy.context.object; step.scale = (0.62, 0.05, 0.20)
bev = step.modifiers.new("b", 'BEVEL'); bev.width = 0.02; bev.segments = 4
step.data.materials.append(GOLD)

mark = [frame, panel, sun, step]
for o in mark:
    o.location.y += 0.15   # lift mark above wordmark

# ---------- wordmark ----------
def text(body, font, size, y, mat_, extrude=0.03, spacing=1.0):
    cu = bpy.data.curves.new("T", 'FONT'); cu.body = body
    cu.font = bpy.data.fonts.load(font); cu.size = size; cu.align_x = 'CENTER'
    cu.extrude = extrude; cu.bevel_depth = 0.004; cu.space_character = spacing
    ob = bpy.data.objects.new("T", cu); sc.collection.objects.link(ob)
    ob.location = (0, y, 0); ob.data.materials.append(mat_)
    return ob

ar = os.environ.get("AR_VISUAL", "بوابة")  # pre-shaped (arabic_reshaper + bidi) by render.sh
text(ar, "/usr/share/fonts/truetype/kacst-one/KacstOne-Bold.ttf", 0.36, -0.36, GOLD, 0.04)
text("BAWABA", "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 0.08, -0.58, GOLD, 0.015, 1.6)

# ---------- 3/4 pose ----------
pivot = bpy.data.objects.new("Pivot", None); sc.collection.objects.link(pivot)
for o in list(sc.collection.objects):
    if o.type in {'CURVE', 'FONT', 'MESH'} and o is not pivot: o.parent = pivot
pivot.rotation_euler = (0, 0, 0) if TURN else (math.radians(6), math.radians(-16), 0)
pivot.location.y = -0.28

# ---------- stage ----------
# Logo is built in the XY plane facing +Z; backdrop is a flat wall behind it.
bpy.ops.mesh.primitive_plane_add(size=80, location=(0, 0, -2.5 if TURN else -0.30))
bpy.context.object.data.materials.append(STAGE)

# ---------- lights ----------
def area(name, loc, energy, size, color=(1,1,1)):
    d = bpy.data.lights.new(name, 'AREA'); d.energy = energy; d.size = size; d.color = color
    o = bpy.data.objects.new(name, d); sc.collection.objects.link(o); o.location = loc
    o.rotation_euler = (Vector((0, 0, 0)) - Vector(loc)).to_track_quat('-Z', 'X').to_euler()
    return o
area("Key",  (-2.6, 2.2, 3.2), 420, 2.5, (1.0, 0.93, 0.85))
area("Rim",  ( 2.8, 1.6, 1.0), 260, 1.2, (0.55, 0.85, 1.0))
area("Fill", ( 0.0,-2.5, 3.0), 45,  4.0, (1.0, 0.9, 0.8))
w = bpy.data.worlds.new("W"); sc.world = w; w.use_nodes = True
w.node_tree.nodes["Background"].inputs[0].default_value = (0.01, 0.014, 0.016, 1)
w.node_tree.nodes["Background"].inputs[1].default_value = 0.4

# ---------- camera ----------
cd = bpy.data.cameras.new("Cam"); cd.lens = 85
cam = bpy.data.objects.new("Cam", cd); sc.collection.objects.link(cam); sc.camera = cam
cam.location = (0, 0.06, 7.2); cam.rotation_euler = (0, 0, 0)

# ---------- turntable ----------
# Only the mark spins; the wordmark stays facing camera so it is always legible.
if TURN:
    spin = bpy.data.objects.new("Spin", None); sc.collection.objects.link(spin); spin.parent = pivot
    for o in mark: o.parent = spin
    sc.frame_start, sc.frame_end = 1, TURN
    sc.render.fps = 30
    spin.rotation_euler.y = 0
    spin.keyframe_insert("rotation_euler", index=1, frame=1)
    spin.rotation_euler.y = math.radians(360)
    spin.keyframe_insert("rotation_euler", index=1, frame=TURN + 1)   # frame N+1 == frame 1 -> seamless loop
    for fc in spin.animation_data.action.fcurves:
        for k in fc.keyframe_points: k.interpolation = 'LINEAR'

# ---------- render ----------
r = sc.render; r.engine = 'BLENDER_EEVEE' if ENGINE == 'EEVEE' else 'CYCLES'; r.resolution_x = r.resolution_y = RES
r.filepath = OUT; r.image_settings.file_format = 'PNG'
sc.cycles.device = 'CPU'; sc.cycles.samples = SAMPLES; sc.cycles.use_denoising = False
sc.cycles.sample_clamp_indirect = 3.0; sc.cycles.blur_glossy = 1.0
sc.view_settings.view_transform = 'AgX' if 'AgX' in [i.identifier for i in sc.view_settings.bl_rna.properties['view_transform'].enum_items] else 'Filmic'
sc.view_settings.look = 'None'
if r.engine == 'BLENDER_EEVEE':
    e = sc.eevee
    e.taa_render_samples = SAMPLES
    e.use_ssr = True; e.use_ssr_refraction = False; e.ssr_quality = 1.0; e.ssr_thickness = 0.1
    e.use_gtao = True; e.gtao_distance = 0.4
    e.use_bloom = True; e.bloom_intensity = 0.04; e.bloom_threshold = 1.2
    e.use_soft_shadows = True; e.shadow_cube_size = '2048'; e.shadow_cascade_size = '2048'
    for L in bpy.data.lights: L.shadow_soft_size = L.size if hasattr(L, "size") else 0.25
if TURN:
    frame = os.environ.get("ONLY_FRAME")
    if frame:  # single test frame
        sc.frame_set(int(frame)); bpy.ops.render.render(write_still=True)
    else:
        r.filepath = OUT.rstrip("/") + "/f_"; bpy.ops.render.render(animation=True)
else:
    bpy.ops.render.render(write_still=True)
