/*var defTiMouseup = function(e){
    var tiEl = e.currentTarget;
    $(".selectedDataBox").removeClass(".selectedDataBox");
    tiEl.classList.toggle("selectedDataBox");
    tiEl.insertAdjacentHTML('beforeend', )
};*/

//$(".textInput").mouseup(defTiMouseup);


var defTextDbInputChange = function(e){
    var tbEl = e.target;
    var node = noodle.nodes.getObj(noodle.tools.html.getParentNodeEl(tbEl));
    node.core.data.text = tbEl.value;
    noodle.nodes.execute(node);
}