/* global mermaid:true */

sap.ui.define([
    "pt/chain/OpenFlow/libs/mermaid"
], function(mermaidjs) {
    "use strict";

    const direction = {
        TOP_DOWN: "TD",
        LEFT_RIGHT: "LR"
    };

    return {
        /**
         * Change default settings for the flowcharting
         * @param {Object} oOptions JSON object with flowchart settings
         */
        setOptions: function(oOptions) {
            this._oChartOptions = oOptions;
        },

        /**
         * Designs the flowchart object in the UI
         * @param {Array} aSteps Array of the activities
         * @param {Array} aSequence Array of the sequence of steps
         */
        buildFlowchart: function(aSteps, aSequence) {
            this._aFlowDiagram = [];
            this._oChartOptions = {
                direction: direction.TOP_DOWN,
                manualStepCss: undefined,
                automaticStepCss: undefined,
                displayText: true
            };
            this._aSteps = aSteps;
            this._aSequence = aSequence;

            const oElement = document.querySelector(".mermaid");
            const insertSvg = function(svgCode, bindFunctions){
                oElement.innerHTML = svgCode;
            };

            const graphDefinition = this._buildFlowchart();
            console.log(graphDefinition);

            const graph = mermaid.mermaidAPI.render('graphDiv', graphDefinition, insertSvg);
        },

        /**
         * Create the flowchart metadata definition
         */
        _buildFlowchart: function() {
            const sFirst = "graph TD\n";
            this._aFlowDiagram.push(sFirst);

            for (let i = 0; i < this._aSequence.length; i++) {
                let oPreviousNode = this._getStepDetail(this._aSequence[i].fromId);
                let oNextNode = this._getStepDetail(this._aSequence[i].toId);
                let sRow = `${ this._formatNode(oPreviousNode) } ` +
                            `-->|${ this._aSequence[i].seq }| ` +
                            `${ this._formatNode(oNextNode) }`;
                this._aFlowDiagram.push(sRow);
            }

            let sResult = ``;
            for (let e = 0; e < this._aFlowDiagram.length; e++) {
                sResult += `${ this._aFlowDiagram[e] }\n`;
            }
            return sResult;
        },

        /**
         * Returns an Object with the activity step detail
         * @param {String} sId Step ID
         * @returns {Object} Step detail
         */
        _getStepDetail: function(sId) {
            for (let i = 0; i < this._aSteps.length; i++) {
                if (this._aSteps[i].activity === sId) {
                    return this._aSteps[i];
                }
            }
        },

        /**
         * Returns the formatted string for the node in the chart
         * @param {Object} oStep Step detail object
         */
        _formatNode: function(oStep) {
            if (this._oChartOptions.displayText) {
                return `${ oStep.activity }("${ oStep.activity }: ${ oStep.description }")`;
            } else {
                return `${ oStep.activity }`;
            }
        }
    };
});
