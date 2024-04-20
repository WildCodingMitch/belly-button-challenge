// Define URL
const url = "https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json"


// Get JSON Data and Store
let data = d3.json(url).then(function(data) {
    console.log(data);
});


// Initialize Page Setup
function init () {
    // Select Dropdown Menu using D3.select
    let dropdownMenu = d3.select("#selDataset");

    // Populate Dropdown with SampleIDs
    d3.json(url).then(function(data) {
        let sampleNames = data.names;
        sampleNames.forEach((name) => {
            // Append each SampleID to Dropdown Menu
            dropdownMenu.append("option")
            .text(name)
            .property("value", name);
        });

            // Get the First Sample in the List
            let firstSample = sampleNames[0]

            // Populate initial data, Generate inital Bar and Bubble Charts
            buildMetadata(firstSample);
            genBarChart(firstSample);
            genBubbleChart(firstSample);
    });

};
init()


// Build Metadata(Demographic Info) Panel
function buildMetadata (sampleID) {
    // Get JSON Data
    d3.json(url).then(function(data) {
        let metadata = data.metadata;

        // Filter Data based on SampleID
        let sampleArray = metadata.filter(sample => sample.id == sampleID);
        let sample = sampleArray[0];

        // Select Metadata Panel using D3.select
        let panel = d3.select("#sample-metadata");
        panel.html("");

        // Loop through Keys and Append to Metadata Panel
        for (key in sample) {
            panel.append("h6").text(key.toUpperCase()+": "+sample[key])
        }
    })
}


// Generate Bar Chart
function genBarChart (sampleID) {
    d3.json(url).then(function(data) {
        let samples = data.samples;

        // Filter Data based on SampleID
        let sampleArray = samples.filter(sample => sample.id == sampleID);
        let sample = sampleArray[0];
        
        // Declare Variables for Data Values
        let otu_ids = sample.otu_ids
        let sample_values = sample.sample_values
        let otu_labels = sample.otu_labels
        
        // Define Values
        let trace1 = [
            {x: sample_values.slice(0,10).reverse(),
            y: otu_ids.slice(0,10).map(otu_id => "OTU "+otu_id).reverse(),
            text: otu_labels.slice(0,10).reverse(),
            type:"bar",
            orientation:"h" }
        ];

        // Define Layout
        let layout = {
            title:"Top 10 Bacteria Cultures Found",
            xaxis: {title:"Number of Bacteria"},
            height: 600,
            width: 800
        };

        // Plot Bar Chart
        Plotly.newPlot("bar", trace1, layout)

    });

};


// Generate Bubble Chart
function genBubbleChart (sampleID) {
    d3.json(url).then(function(data) {
        let samples = data.samples;

        // Filter Data based on SampleID
        let sampleArray = samples.filter(sample => sample.id == sampleID);
        let sample = sampleArray[0];
        
        // Declare Variables for Data Values
        let otu_ids = sample.otu_ids
        let sample_values = sample.sample_values
        let otu_labels = sample.otu_labels
        
        // Define Values
        let trace2 = [
            {x: otu_ids,
            y: sample_values,
            text: otu_labels,
            mode:"markers",
            marker:{
                size: sample_values, 
                color: otu_ids,
                colorscale: "Earth"
            }
            
            }];

        // Define Layout
        let layout = {
            xaxis: {title:"OTU ID"},
            yaxis: {title:"Number of Bacteria"},
            height: 600,
            width: 1200
        };

        // Plot Bubble Chart
        Plotly.newPlot("bubble", trace2, layout)

    });
};


// Update Plots on Sample Change
function optionChanged(sampleID) {
    buildMetadata(sampleID);
    genBarChart(sampleID);
    genBubbleChart(sampleID);
};