AFRAME.registerComponent("model", {
    init: async function () {
        var fetchModel = await this.getModel();
        var barcodes = Object.keys(fetchModel);

        barcodes.map(barcode => {
            var model = compounds[barcode];
            this.createAtoms(model);
        });
    },
    getModel:function() {
        return fetch("model.json")
          .then(res => res.json())
          .then(data => data);
    },
    createModel:function(model) {
        var barcodeValue = model.barcode_value;
        var modelUrl = model.model_url;
        var modelName = model.model_name;

        var scene = document.querySelector("a-scene");

        var marker = document.createElement("a-marker");

        marker.setAttribute("id", `marker-${barcodeValue}`);
        marker.setAttribute("type", "barcode");
        marker.setAttribute("model_name", modelName);
        marker.setAttribute("value", barcodeValue);
        marker.setAttribute("markerhandler", {})
        scene.appendChild(marker);

        if(barcodeValue === 0) {
            var modelEl = document.createElement("a-entity");
            modelEl.setAttribute("id", `${modelName}`);
            modelEl.setAttribute("geometry", {
                primitive: box,
                width: model.width,
                height: model.height
            });
            modelEl.setAttribute("position", model.position);
            modelEl.setAttribute("rotation", model.rotation);
            modelEl.setAttribute("material", {
                color: model.color
            });
            marker.appendChild(modelEl);
        } else {
            var modelEl = document.createElement("a-entity");
            modelEl.setAttribute("id", `${modelName}`);
            modelEl.setAttribute("gltf-model", `url(${modelUrl})`);
            modelEl.setAttribute("scale", model.scale);
            modelEl.setAttribute("position", model.position);
            modelEl.setAttribute("rotation", model.rotation);
            marker.appendChild(modelEl);
        }
    }
})