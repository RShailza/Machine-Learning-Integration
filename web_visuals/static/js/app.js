//////// Title Animation //////////////
// Wrap every letter in a span
var textWrapper = document.querySelector('.ml2');
textWrapper.innerHTML = textWrapper.textContent.replace(/\S/g, "<span class='letter'>$&</span>");

anime.timeline({loop: true})
  .add({
    targets: '.ml2 .letter',
    scale: [4,1],
    opacity: [0,1],
    translateZ: 0,
    easing: "easeOutExpo",
    duration: 950,
    delay: (el, i) => 70*i
  }).add({
    targets: '.ml2',
    opacity: 0,
    duration: 1000,
    easing: "easeOutExpo",
    delay: 1000
  });

  //////// END - Title Animation //////////////

  //////////OPTION CHANGE /////////////////////

  rows = [];

  const tbody = d3.select("tbody");


function optionChanged(yr_choice) {

    ///////////// Bubble Chart //////////////
    d3.json('/data').then(function (myData) {

        var ss_filtered = myData.suicide.filter(x => x.year == yr_choice);

        var suicide = [];
        
        var tmp_sNo = 0;
        var tmp_pop = 0;
        var sPer = 0;
        for (var g = 0; g < ss_filtered.length; g++) {
            
            if (g == (ss_filtered.length-1)) {
                tmp_sNo = tmp_sNo + ss_filtered[g].suicides_no;
                tmp_pop = tmp_pop + ss_filtered[g].population;
                sPer = (tmp_sNo / tmp_pop)* 100000;
                suicide.push({"country": ss_filtered[g].country,
                    "year": ss_filtered[g].year,
                    "suicideNo": tmp_sNo,
                    "population": tmp_pop,
                    "perOne": sPer})
                tmp_sNo = 0;
                tmp_pop = 0;}
            else if (ss_filtered[g].country==ss_filtered[g+1].country && ss_filtered[g].year==ss_filtered[g+1].year) {
                tmp_sNo = tmp_sNo + ss_filtered[g].suicides_no;
                tmp_pop = tmp_pop + ss_filtered[g].population;
            } else {
                tmp_sNo = tmp_sNo + ss_filtered[g].suicides_no;
                tmp_pop = tmp_pop + ss_filtered[g].population;
                sPer = (tmp_sNo / tmp_pop) * 100000;
                suicide.push({"country": ss_filtered[g].country,
                    "year": ss_filtered[g].year,
                    "suicideNo": tmp_sNo,
                    "population": tmp_pop,
                    "perOne": sPer})
                tmp_sNo = 0;
                tmp_pop = 0;
            }

        }

        var happy_filtered = myData.happiness.filter(x => x.year == yr_choice);

        var scatterData = [];
        
    
        for (var z = 0; z < suicide.length; z++) {
            for (var t = 0; t < happy_filtered.length; t++) {
                if (suicide[z].country==happy_filtered[t].Country && suicide[z].year==happy_filtered[t].year) {
                    scatterData.push({"country": suicide[z].country,
                        "year": suicide[z].year,
                        "suicideNo": suicide[z].suicideNo,
                        "population": suicide[z].population,
                        "perOne": suicide[z].perOne,
                        "happiness_score": happy_filtered[t].happiness_score})
                } 
            }

        }

        ////////// Chart //////////
        
        var ctry_ = [];
        var ss = [];
        var happy_ = [];
        var happy_Color = [];
        var ssSize = [];

        for (var key1 in scatterData) {
            ctry_.push(scatterData[key1].country);
            ss.push(scatterData[key1].perOne );
            happy_.push(scatterData[key1].happiness_score);
            happy_Color.push((scatterData[key1].happiness_score * 3));
            ssSize.push((scatterData[key1].perOne * 2));
            };

        var traceBubble = {
            x: happy_,
            y: ss,
            text: ctry_,
            mode: 'markers',
            marker: {
                color: happy_,
                colorscale: 'Portland',
                reversescale: true,
            size: ssSize 
            }
        };
        
        var traceDataBub = [traceBubble];
        
        var bubbleLayout ={
            // title: 'Happiness Score vs Suicide Rates by Country',
            xaxis: {
                title: 'Happiness Score'},
            yaxis: {
                title: 'Suicides per 100K'}
        };
        
        Plotly.newPlot('bubble', traceDataBub, bubbleLayout, {responsive: true});



    
    ///////////// END - Bubble Chart //////////////



    ///////////// Bar Chart //////////////////
        var happy_results = myData.happiness.filter(x => x.year == yr_choice);

        //**************************creating empty list**************************//
        //************************************************************************//
    
        var sh_score = [];
        var Region = [];
        var life_exp = [];
        // var y2 = [];

        //**************************Creating forloop**************************///
        //************************************************************************//

        for (var barI = 0; barI < happy_results.length; barI++) {
        var h_score = happy_results[barI].happiness_score;
        //var rank = happy_results[barI].happiness_rank;
        var h_Region = happy_results[barI].Region;
        var l_expec = happy_results[barI].life_expectancy;
    
        sh_score.push(h_score);
        Region.push(h_Region);
        life_exp.push(l_expec*100)
        }



        //**************************creating bar graphs trace for happiness score**************************//
        //************************************************************************//

        var bar_data = [
        {
            x: Region,
            y: sh_score,
            type: "bar",
            marker: {
            color: "#6CC3D5",
            line: {
                color: "#6CC3D5",
                width: 1.5,
            },
            },
            transforms: [
            {
                type: "aggregate",
                groups: Region,
                aggregations: [{ target: "y", func: "avg", enabled: true }],
            },
            ],
        },
        ];
        var barlayout = {
            title: "Use dropdown to change aggregation",
            // <b>Plotly Aggregations</b><br></br>
            xaxis: { title: "Region", automargin: true },
            yaxis: { title: "Happiness Score", range: [0, 10]},
            updatemenus: [
                {
                x: 0.85,
                y: 1.15,
                xref: "paper",
                yref: "paper",
                //xanchor: "right",
                yanchor: "top",
                active: 0,
                showactive: false,
                buttons: [
                    {
                    method: "restyle",
                    args: ["transforms[0].aggregations[0].func", "avg"],
                    label: "Avg",
                    },

                    {
                    method: "restyle",
                    args: ["transforms[0].aggregations[0].func", "min"],
                    label: "Min",
                    },
                    {
                    method: "restyle",
                    args: ["transforms[0].aggregations[0].func", "max"],
                    label: "Max",
                    },
                    {
                    method: "restyle",
                    args: ["transforms[0].aggregations[0].func", "mode"],
                    label: "Mode",
                    },
                    {
                    method: "restyle",
                    args: ["transforms[0].aggregations[0].func", "median"],
                    label: "Median",
                    },

                    {
                    method: "restyle",
                    args: ["transforms[0].aggregations[0].func", "stddev"],
                    label: "Std.Dev",
                    },
                ]
                }
            ]
        };
    
    
        //var data = [t1,t2];
        Plotly.newPlot("myagg", bar_data, barlayout, {responsive: true});
    // });



    /////////////END - Bar Chart //////////////
    ///////////// Life Expectancy Bar Chart //////////////

    var bar2_data = [
        {
            x: Region,
            y: life_exp,
            type: "bar",
            marker: {
            color: "#6CC3D5",
            line: {
                color: "#6CC3D5",
                width: 1.5,
            },
            },
            transforms: [
            {
                type: "aggregate",
                groups: Region,
                aggregations: [{ target: "y", func: "avg", enabled: true }],
            },
            ],
        },
        ];
        var bar2layout = {
            // title: "Life Expectancy by Region",
            title: "Use dropdown to change aggregation",
            xaxis: { title: "Region", automargin: true },
            yaxis: { title: "Life Expectancy", range: [0, 120]},
            updatemenus: [
                {
                x: 0.85,
                y: 1.15,
                xref: "paper",
                yref: "paper",
                //xanchor: "right",
                yanchor: "top",
                active: 0,
                showactive: false,
                buttons: [
                    {
                    method: "restyle",
                    args: ["transforms[0].aggregations[0].func", "avg"],
                    label: "Avg",
                    },

                    {
                    method: "restyle",
                    args: ["transforms[0].aggregations[0].func", "min"],
                    label: "Min",
                    },
                    {
                    method: "restyle",
                    args: ["transforms[0].aggregations[0].func", "max"],
                    label: "Max",
                    },
                    {
                    method: "restyle",
                    args: ["transforms[0].aggregations[0].func", "mode"],
                    label: "Mode",
                    },
                    {
                    method: "restyle",
                    args: ["transforms[0].aggregations[0].func", "median"],
                    label: "Median",
                    },

                    {
                    method: "restyle",
                    args: ["transforms[0].aggregations[0].func", "stddev"],
                    label: "Std.Dev",
                    },
                ]
                }
            ]
        };


        //var data = [t1,t2];
        Plotly.newPlot("mylifeagg", bar2_data, bar2layout, {responsive: true});

    //////////END - Life Expectancy Bar Chart ////////////

    ///////////// Map Chart //////////////


        tbody.html("");

       
            console.log("Year")
            console.log(myData)

            if (yr_choice == "2015") {

    //             var five_results = myData.happiness.filter(x => x.year == '2015');

                for (var i = 0; i < myData.happiness.length; i++) {
                    if (myData.happiness[i].year == '2015') {
                        
                        var country = myData.happiness[i].Country;
                        var code = myData.happiness[i].code;
                        var rank = myData.happiness[i].happiness_rank;
                        var score = myData.happiness[i].happiness_score;

                        rows.push({
                            "country": country,
                            "score": score,
                            "rank": rank,
                            "code": code
                        });
                    }

                };

                function unpack(rows, key) {
                    return rows.map(function (row) { return row[key]; });
                }

                var data = [{
                    type: 'choropleth',
                    locations: unpack(rows, 'code'),
                    z: unpack(rows, 'score'),
                    text: unpack(rows, 'country'),
                    colorscale: 'Portland',
                    autocolorscale: false,
                    reversescale: true,
                    marker: {
                        line: {
                            color: 'rgb(180,180,180)',
                            width: 0.5
                        }
                    },
                    tick0: 0,
                    zmin: 0,
                    dtick: 1000,
                    colorbar: {
                        autotic: false,
                        tickprefix: '',
                        title: 'Happiness<br>Score'
                    }
                }];

                var layout = {
                    geo: {
                        showframe: false,
                        showcoastlines: false,
                        projection: {
                            type: 'mercator'
                                                }
                    },
                    width: 800,
                    height: 650,
                };
                fig = Plotly.newPlot("myDiv", data, layout, { showLink: false }, {responsive: true});


    
                rows.forEach((row_data) => {
                    // Create tr for each row of the table
                    const row = tbody.append("tr");

                    // Create multiple td cells for each row
                    Object.values(row_data).forEach((value) => {
                        if (value != '2015') {
                            let cell = row.append("td");
                            cell.text(value);
                        }
                    });
                });
            }

            else if (yr_choice == "2016") {


            //             var five_results = myData.happiness.filter(x => x.year == '2015');

                for (var i = 0; i < myData.happiness.length; i++) {
                    if (myData.happiness[i].year == '2016') {
                        
                        var country = myData.happiness[i].Country;
                        var code = myData.happiness[i].code;
                        var rank = myData.happiness[i].happiness_rank;
                        var score = myData.happiness[i].happiness_score;

                        rows.push({
                            "country": country,
                            "score": score,
                            "rank": rank,
                            "code": code
                        });
                    }

                };

                console.log("rows check")
                console.log(rows)

                function unpack(rows, key) {
                    return rows.map(function (row) { return row[key]; });
                }

                var data = [{
                    type: 'choropleth',
                    locations: unpack(rows, 'code'),
                    z: unpack(rows, 'score'),
                    text: unpack(rows, 'country'),
                    colorscale: 'Portland',
                    autocolorscale: false,
                    reversescale: true,
                    marker: {
                        line: {
                            color: 'rgb(180,180,180)',
                            width: 0.5
                        }
                    },
                    tick0: 0,
                    zmin: 0,
                    dtick: 1000,
                    colorbar: {
                        autotic: false,
                        tickprefix: '',
                        title: 'Happiness<br>Score'
                    }
                }];

                var layout = {
                    geo: {
                        showframe: false,
                        showcoastlines: false,
                        projection: {
                            type: 'mercator'
                        }
                    },
                    width: 800,
                    height: 650

                };
                Plotly.newPlot("myDiv", data, layout, { showLink: false }, {responsive: true});


                rows.forEach((row_data) => {
                    // Create tr for each row of the table
                    const row = tbody.append("tr");

                    console.log("row_data")
                    console.log(row_data)

                    // Create multiple td cells for each row
                    Object.values(row_data).forEach((value) => {
                        if (value != '2016') {
                            let cell = row.append("td");
                            cell.text(value);
                        }
                    });
                });
            }
    
    ///////////// END - Map Chart //////////////
    });
};





/////// Initial Chart State //////////////////////

function initCharts() {
    d3.json('/data').then(function (myData) {

        ///// Initial Bubble Chart ////////
        var ss_filtered = myData.suicide.filter(x => x.year == '2015');

        var suicide = [];
        
        var tmp_sNo = 0;
        var tmp_pop = 0;
        var sPer = 0;
        for (var i = 0; i < ss_filtered.length; i++) {
            
            if (i == (ss_filtered.length-1)) {
                tmp_sNo = tmp_sNo + ss_filtered[i].suicides_no;
                tmp_pop = tmp_pop + ss_filtered[i].population;
                sPer = (tmp_sNo / tmp_pop)* 100000;
                suicide.push({"country": ss_filtered[i].country,
                    "year": ss_filtered[i].year,
                    "suicideNo": tmp_sNo,
                    "population": tmp_pop,
                    "perOne": sPer})
                tmp_sNo = 0;
                tmp_pop = 0;}
            else if (ss_filtered[i].country==ss_filtered[i+1].country && ss_filtered[i].year==ss_filtered[i+1].year) {
                tmp_sNo = tmp_sNo + ss_filtered[i].suicides_no;
                tmp_pop = tmp_pop + ss_filtered[i].population;
            } else {
                tmp_sNo = tmp_sNo + ss_filtered[i].suicides_no;
                tmp_pop = tmp_pop + ss_filtered[i].population;
                sPer = (tmp_sNo / tmp_pop) * 100000;
                suicide.push({"country": ss_filtered[i].country,
                    "year": ss_filtered[i].year,
                    "suicideNo": tmp_sNo,
                    "population": tmp_pop,
                    "perOne": sPer})
                tmp_sNo = 0;
                tmp_pop = 0;
            }

        }

        var happy_filtered = myData.happiness.filter(x => x.year == '2015');

        var scatterData = [];
        
        var tmp_sNo = 0;
        var tmp_pop = 0;
        var sPer = 0;
        for (var z = 0; z < suicide.length; z++) {
            for (var t = 0; t < happy_filtered.length; t++) {
                if (suicide[z].country==happy_filtered[t].Country && suicide[z].year==happy_filtered[t].year) {
                    scatterData.push({"country": suicide[z].country,
                        "year": suicide[z].year,
                        "suicideNo": suicide[z].suicideNo,
                        "population": suicide[z].population,
                        "perOne": suicide[z].perOne,
                        "happiness_score": happy_filtered[t].happiness_score})
                } 
            }

        }


        ////////// Bubble Chart //////////
        
        var ctry_ = [];
        var ss = [];
        var happy_ = [];
        var ssSize = [];

        for (var key1 in scatterData) {
            ctry_.push(scatterData[key1].country);
            ss.push(scatterData[key1].perOne );
            happy_.push(scatterData[key1].happiness_score);
            ssSize.push((scatterData[key1].perOne * 2));
            };


         var traceBubble = {
            x: happy_,
            y: ss,
            text: ctry_,
            mode: 'markers',
            marker: {
                color: happy_,
                colorscale: 'Portland',
                reversescale: true,
            size: ssSize 
            }
        };
        
        var traceDataBub = [traceBubble];
        
        var bubbleLayout ={
            // title: 'Happiness Score vs Suicide Rates by Country',
            xaxis: {
                title: 'Happiness Score'},
            yaxis: {
                title: 'Suicides per 100K'}
        };

        var config = {responsive: true}
        
        Plotly.newPlot('bubble', traceDataBub, bubbleLayout, {responsive: true});

        ///// END - Initial Bubble Chart ////////

        ///////////// Bar Chart //////////////////


        var happy_results = myData.happiness.filter(x => x.year == '2015');

        //**************************creating empty list**************************//
        //************************************************************************//
    
        var sh_score = [];
        var Region = [];
        var life_exp = [];
        // var y2 = [];

        //**************************Creating forloop**************************///
        //************************************************************************//

        for (var i = 0; i < happy_results.length; i++) {
        var h_score = happy_results[i].happiness_score;
        var rank = happy_results[i].happiness_rank;
        var h_Region = happy_results[i].Region;
        var l_expec = happy_results[i].life_expectancy;
    
        sh_score.push(h_score);
        Region.push(h_Region);
        life_exp.push(l_expec*100)
        }
        


        //**************************creating bar graphs trace for happiness score**************************//
        //************************************************************************//

        var bar_data = [
        {
            x: Region,
            y: sh_score,
            type: "bar",
            marker: {
            color: "#6CC3D5",
            line: {
                color: "#6CC3D5",
                width: 1.5,
            },
            },
            transforms: [
            {
                type: "aggregate",
                groups: Region,
                aggregations: [{ target: "y", func: "avg", enabled: true }],
            },
            ],
        },
        ];
        barlayout = {
        title: "Use dropdown to change aggregation",
        // <b>Plotly Aggregations</b><br>
        xaxis: { title: "Region", automargin: true },
        yaxis: { title: "Happiness Score", range: [0, 10]},
        updatemenus: [
            {
            x: 0.85,
            y: 1.15,
            xref: "paper",
            yref: "paper",
            //xanchor: "right",
            yanchor: "top",
            active: 0,
            showactive: false,
            buttons: [
                {
                method: "restyle",
                args: ["transforms[0].aggregations[0].func", "avg"],
                label: "Avg",
                },
                {
                method: "restyle",
                args: ["transforms[0].aggregations[0].func", "min"],
                label: "Min",
                },
                {
                method: "restyle",
                args: ["transforms[0].aggregations[0].func", "max"],
                label: "Max",
                },
                {
                method: "restyle",
                args: ["transforms[0].aggregations[0].func", "mode"],
                label: "Mode",
                },
                {
                method: "restyle",
                args: ["transforms[0].aggregations[0].func", "median"],
                label: "Median",
                },
                // {
                //   method: "restyle",
                //   args: ["transforms[0].aggregations[0].func", "count"],
                //   label: "Count",
                // },
                {
                method: "restyle",
                args: ["transforms[0].aggregations[0].func", "stddev"],
                label: "Std.Dev",
                },
            //   {
            //     method: "restyle",
            //     args: ["transforms[0].aggregations[0].func", "first"],
            //     label: "First",
            //   },
            //   {
            //     method: "restyle",
            //     args: ["transforms[0].aggregations[0].func", "last"],
            //     label: "Last",
            //   },
            ],
            },
        ],
        };
    
    
        //var data = [t1,t2];
        Plotly.newPlot("myagg",bar_data, barlayout);
    //});
        /////////////END - Bar Chart //////////////

        /////////////Initial Life Expectancy Bar Chart //////////////

        var bar2_data = [
            {
                x: Region,
                y: life_exp,
                type: "bar",
                marker: {
                color: "#6CC3D5",
                line: {
                    color: "#6CC3D5",
                    width: 1.5,
                },
                },
                transforms: [
                {
                    type: "aggregate",
                    groups: Region,
                    aggregations: [{ target: "y", func: "avg", enabled: true }],
                },
                ],
            },
            ];
            var bar2layout = {
                // title: "Life Expectancy by Region",
                title: "Use dropdown to change aggregation",
                xaxis: { title: "Region", automargin: true },
                yaxis: { title: "Life Expectancy", range: [0, 120] },
                updatemenus: [
                    {
                    x: 0.85,
                    y: 1.15,
                    xref: "paper",
                    yref: "paper",
                    //xanchor: "right",
                    yanchor: "top",
                    active: 0,
                    showactive: false,
                    buttons: [
                        {
                        method: "restyle",
                        args: ["transforms[0].aggregations[0].func", "avg"],
                        label: "Avg",
                        },
    
                        {
                        method: "restyle",
                        args: ["transforms[0].aggregations[0].func", "min"],
                        label: "Min",
                        },
                        {
                        method: "restyle",
                        args: ["transforms[0].aggregations[0].func", "max"],
                        label: "Max",
                        },
                        {
                        method: "restyle",
                        args: ["transforms[0].aggregations[0].func", "mode"],
                        label: "Mode",
                        },
                        {
                        method: "restyle",
                        args: ["transforms[0].aggregations[0].func", "median"],
                        label: "Median",
                        },
    
                        {
                        method: "restyle",
                        args: ["transforms[0].aggregations[0].func", "stddev"],
                        label: "Std.Dev",
                        },
                    ]
                    }
                ]
            };
        
        
            //var data = [t1,t2];
            Plotly.newPlot("mylifeagg", bar2_data, bar2layout, {responsive: true});

        //////////END - Initial Life Expectancy Bar Chart ////////////



        ///// Initial Map Chart ////////

        for (var i = 0; i < myData.happiness.length; i++) {
            if (myData.happiness[i].year == '2015') {
                                
                var country = myData.happiness[i].Country;
                var code = myData.happiness[i].code;
                var rank = myData.happiness[i].happiness_rank;
                var score = myData.happiness[i].happiness_score;

                rows.push({
                    "country": country,
                    "score": score,
                    "rank": rank,
                    "code": code
                });
            }

        };

        function unpack(rows, key) {
            return rows.map(function (row) { return row[key]; });
        }

        var data = [{
            type: 'choropleth',
            locations: unpack(rows, 'code'),
            z: unpack(rows, 'score'),
            text: unpack(rows, 'country'),
            colorscale: 'Portland',
            autocolorscale: false,
            reversescale: true,
            marker: {
                line: {
                    color: 'rgb(180,180,180)',
                    width: 0.5
                }
            },
            tick0: 0,
            zmin: 0,
            dtick: 1000,
            colorbar: {
                autotic: false,
                tickprefix: '',
                title: 'Happiness<br>Score'
            }
        }];

        var layout = {
            // title: '2015 World Happiness Map<br><a href="https://www.cia.gov/library/publications/the-world-factbook/fields/2195.html"></a>',
            geo: {
                showframe: false,
                showcoastlines: false,
                projection: {
                    type: 'mercator'
                }
            },
            width: 800,
            height: 650
        };
        Plotly.newPlot("myDiv", data, layout, {showLink: false}, {responsive: true});


        rows.forEach((row_data) => {
            // Create tr for each row of the table
            const row = tbody.append("tr");

            // Create multiple td cells for each row
            Object.values(row_data).forEach((value) => {
                if (value != '2015') {
                    let cell = row.append("td");
                    cell.text(value);
                }
            });
        });

        ///// END - Initial Map Chart ////////


    });
}

/////// END - Initial Chart State Function//////////////////////




initCharts();



