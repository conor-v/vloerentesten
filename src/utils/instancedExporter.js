import { Vector2 } from "three";
import { Mesh } from "three";
import { InstancedMesh, Scene } from "three";
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter";

export default async function exportGLTF(input) {
  const gltfExporter = new GLTFExporter();

  const options = {
    trs: false,
    onlyVisible: false,
    truncateDrawRange: true,
    binary: true,
    maxTextureSize: 8192,
  };
  gltfExporter.parse(
    input,
    function (result) {
      if (result instanceof ArrayBuffer) {
        saveArrayBuffer(result, "scene.glb");
      } else {
        const output = JSON.stringify(result, null, 2);
        saveString(output, "scene.gltf");
      }
      const repeat = new Vector2(4, 2);
    },
    function (error) {
      console.log("An error happened during parsing", error);
    },
    options
  );
  return;
}

function saveArrayBuffer(buffer, filename) {
  save(new Blob([buffer], { type: "application/octet-stream" }), filename);
}

function saveString(text, filename) {
  save(new Blob([text], { type: "text/plain" }), filename);
}

const link = document.createElement("a");
link.style.display = "none";
document.body.appendChild(link);

function save(blob, filename) {
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
}
