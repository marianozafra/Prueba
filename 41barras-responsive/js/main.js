 //Función para hacer responsive el gráfico. No hay que tocar nada
 function responsivify(svg) {
    // get container + svg aspect ratio
        var container = d3.select(svg.node().parentNode),
            width = parseInt(svg.style("width")),
            height = parseInt(svg.style("height")),
            aspect = width / height;

        // add viewBox and preserveAspectRatio properties,
        // and call resize so that svg resizes on inital page load
        svg.attr("viewBox", "0 0 " + width + " " + height)
            .attr("preserveAspectRatio", "xMinYMid")
            .call(resize);

        d3.select(window).on("resize." + container.attr("id"), resize);

        // get width of container and resize svg to fit it
        function resize() {
            var targetWidth = parseInt(container.style("width"));
            svg.attr("width", targetWidth);
            svg.attr("height", Math.round(targetWidth / aspect));
        }
  };

d3.json("data/revenues.json").then(function(data){

    var margin = {top:20, right:10, bottom:50, left: 70};
    var width = 500 - margin.right - margin.left;
    var height = 400 - margin.top - margin.bottom;
    var paddingBarras = 10;
    var widthBarras = (width / data.length) - paddingBarras;
    var formatComma = d3.format(",")//Para imprimir los numeros con la , de miles. En esta url estan todos los formatos http://bl.ocks.org/mstanaland/6106487

    // Linear Scale para Y
    var yScale = d3.scaleLinear()
        .domain([0 , d3.max(data,function(d){
            return parseInt(d.revenue)
        })])
        .range([height, 0])

    //Time Scale para X
    var xScale = d3.scaleBand()
        .domain(data.map(function(d){return d.month}))
        .range([0, width])
        .paddingInner(0.2)
        .paddingOuter(0.2);
    
    //Axis
    var bottomAxis = d3.axisBottom()
        .scale(xScale);
    
    var leftAxis = d3.axisLeft()
        .scale(yScale)
        .ticks(4);//ticks son las barritas de la escala

    //Creo el contenedor del gráfico y lo meto dentro de un grupo (g) para poder trasladarlo mejor
    var grafico_starbucks = d3.select("#chart-area")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .call(responsivify)
    .append("g")
        .attr("transform", "translate(" + margin.left + "," +  margin.top +")");
    
    //Pinto Axis
    grafico_starbucks.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0," + height + ")")
        .call(bottomAxis);
    grafico_starbucks.append("g")
        .attr("class", "axis")
        .call(leftAxis);    

    //Barras
    grafico_starbucks.selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .attr("x", function(d){
            return xScale(d.month);
        })    
        .attr("y", function(d){
            return yScale(d.revenue) 
        })
        .classed("barras_starbucks",true)  
        .attr("width", xScale.bandwidth())
        .attr("height",function(d){
            return height - yScale(d.revenue)
        })
    //Cifras      
    grafico_starbucks.selectAll(".cifras")
        .data(data)
        .enter()
        .append("text")
        .classed("cifras", true)
        .text(function(d){
            return formatComma(d.revenue)//Para que se imprima la cifra con el separador de miles
        })
        .attr("x", function(d){
            return xScale(d.month) + xScale.bandwidth()/2;
        })    
        .attr("y", function(d){
            return yScale(d.revenue) - 5
        });    
    //Titulos
    grafico_starbucks.append("text")
        .text("Meses")
        .attr("x", width/2)    
        .attr("y", height + 43)
        .classed("leyenda", true);
          
    grafico_starbucks.append("text")
        .text("Beneficios")
        .classed("leyenda", true)
        .attr("transform", "rotate(-90)")
        .attr("x", - height/2)//Al rotar 90 grados los valores de x e y se invierten    
        .attr("y", -55); 
    
    // d3.interval(function(){
    //     console.log("hello");
    // },1000)   

    var myInterval = setInterval(function(){
        console.log("hello man");
    }, 1000)



})