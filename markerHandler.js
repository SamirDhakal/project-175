modelList = [];

AFRAME.registerComponent("markerhandler", {
    getDistance: function(elA, elB) {
        return elA.object3D.position.distanceTo(elB.object3D.position);
    },
    getModelGeometry: function(model, modelName) {
        var barcodes = Object.keys(models);
        for(var barcode of barcodes) {
            if(models[barcode].model_name == modelName) {
                return {
                    position: model[barcode]["placement_position"],
                    rotation: model[barcode]["placement_rotation"],
                    scale: models[barcode]["placement_scale"],
                    model_url: models[barcode]["model_url"]
                }
            }
        }
    },
    placeTheModels: function(modelName, models) {
        var isListContainModel = this.isModelPresentInArray(modelList, modelName);
        if(isListContainModel) {
            var distance = null;
            var marker1 = document.querySelector(`#marker-base`);
            var marker2 = document.querySelector(`#marker-${modelName}`);

            distance = this.getDistance(marker1, marker2);
            if(distance < 1.25) {
                var modelEl = document.querySelector(`#model-${modelName}`);
                if(isModelPlaced === null) {
                    var el = document.createElement("a-entity");
                    var modelGeometry = this.getModelGeometry(models, modelName);
                    el.setAttribute("id", `model-${modelName}`);
                    el.setAttribute("gltf-model", `url(${modelGeometry.model_url})`);
                    el.setAttribute("position", modelGeometry.position);
                    el.setAttribute("rotation", modelGeometry.rotation);
                    el.setAttribute("scale", modelGeometry.scale);
                    marker1.appendChild(el);
                }
            }
        }
    },
    isModelPresentInArray: function(arr, val) {
        for(var i of arr) {
            if(i.model_name === val) {
                return true;
            }
        }
        return false;
    },
    tick: async function() {
        if(modelList.length > 1) {
            var isBaseModelPresent = this.isModelPresentInArray(modelList, "base");
            var messageText = document.querySelector("#message-text");

            if(!isBaseModelPresent) {
                messageText.setAttribute("visible", true);
            } else {
                if(model === null) {
                    models = await this.getModels();
                }

                messageText.setAttribute("visible", false);
                this.placeTheModels("road", models);
                this.placeTheModels("car", models);
                this.placeTheModels("sun", models);
            }
        }
    }
})