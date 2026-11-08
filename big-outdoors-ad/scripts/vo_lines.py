import sys, soundfile as sf
from kokoro_onnx import Kokoro
M,OUT=sys.argv[1],sys.argv[2]
k=Kokoro(f"{M}/kokoro-v1.0.onnx", f"{M}/voices-v1.0.bin")
lines=[("line1","Shipment delayed? Every second counts!",1.15),
("line2","Big Outdoors Expedite L.L.C. is ready to move!",1.18),
("line3","From Chicago to Texas, delivering in record time!",1.12),
("line4","Your shipment. Our priority.",1.05)]
for key,t,sp in lines:
  s,sr=k.create(t, voice="am_onyx", speed=sp, lang="en-us")
  sf.write(f"{OUT}/{key}.wav", s, sr); print(key, round(len(s)/sr,2))
