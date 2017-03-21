

var express = require("express");
var bodyParser = require("body-parser");
var helmet = require("helmet");
var path = require('path');

var app = express();


var MongoClient = require('mongodb').MongoClient;
var mdbURL = "mongodb://admin:admin@ds137230.mlab.com:37230/sos03";

var port = (process.env.PORT || 10000);
var BASE_API_PATH = "/api/v1";
var dbRuben;
var dbRaul;
var dbIvan;


app.use(bodyParser.json()); 
app.use(helmet());

MongoClient.connect(mdbURL,{native_parser:true}, function(err,database){
    
    if(err){
        console.log("CAN NOT CONNECT TO DB: " +err);
        process.exit(1);
    }
    
    dbRuben = database.collection("results");
    dbRaul = database.collection("earlyleavers");
    dbIvan = database.collection("investmenteducation");
    

    app.listen(port, () => {
       console.log("Magic is happening on port " + port);
    
});

});

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////CODIGO API RUBEN////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Load Initial Data
app.get(BASE_API_PATH + "/results/loadInitialData",function(request, response) {
    
    dbRuben.find({}).toArray(function(err,results){
        
         if (err) {
        console.error('WARNING: Error while getting initial data from DB');
        return 0;
    }
    
      if (results.length === 0) {
        console.log('INFO: Empty DB, loading initial data');

              var results = [{
                "country": "Spain",
                "year": "2012",
                "science-calification": "496",
                "reading-calification": "488",
                "math-calification": "484"
            },
            {
                "country": "Spain",
                "year": "2015",
                "science-calification": "493",
                "reading-calification": "496",
                "math-calification": "486"
            },
            {
                "country": "Finland",
                "year": "2015",
                "science-calification": "531",
                "reading-calification": "526",
                "math-calification": "511"
            }];
        
    dbRuben.insert(results);
      } else {
        console.log('INFO: DB has ' + results.length + ' results ');
    }
});
});

//Base GET
app.get("/", function (request, response) {
    console.log("INFO: Redirecting to /results");
    response.redirect(301, BASE_API_PATH + "/results");
});


// GET a collection
app.get(BASE_API_PATH + "/results", function (request, response) {
    
    console.log("INFO: New GET request to /results");
    dbRuben.find({}).toArray(function (err, results) {
        if (err) {
            console.error('WARNING: Error getting data from DB');
            response.sendStatus(500); // internal server error
        } else {
            console.log("INFO: Sending contacts: " + JSON.stringify(results, 2, null));
            response.send(results);
        }
    });
});

// GET a collection de un mismo año 

app.get(BASE_API_PATH + "/results/:year", function (request, response) {
    var year = request.params.year;
    var country = request.params.year;

    if(isNaN(request.params.year.charAt(0))){
        

            if (!country) {
        console.log("WARNING: New GET request to /results/:country without name, sending 400...");
        response.sendStatus(400); // bad request
    } else {
        console.log("INFO: New GET request to /results/" + country);
        dbRuben.find({country:country}).toArray(function (err, results) {
            if (err) {
                console.error('WARNING: Error getting data from DB');
                response.sendStatus(500); // internal server error
            } else if (results.length > 0) { 
                    var result = results; //since we expect to have exactly ONE contact with this name
                    console.log("INFO: Sending result: " + JSON.stringify(result, 2, null));
                    response.send(result);
                } else {
                    console.log("WARNING: There are not any result with country " + country);
                    response.sendStatus(404); // not found
                
                }
        });

}
    }else{

    if (!year) {
        console.log("WARNING: New GET request to /results/:year without year, sending 400...");
        response.sendStatus(400); // bad request
    } else {
        console.log("INFO: New GET request to /results/" + year);
        dbRuben.find({year:year}).toArray(function (err, results) {
            if (err) {
                console.error('WARNING: Error getting data from DB');
                response.sendStatus(500); // internal server error
            } else if (results.length > 0) { 
                    var result = results; //since we expect to have exactly ONE contact with this name
                    console.log("INFO: Sending result: " + JSON.stringify(result, 2, null));
                    response.send(result);
                } else {
                    console.log("WARNING: There are not any result with year " + year);
                    response.sendStatus(404); // not found
                
                }
        });
}
    
}});

// GET a collection de un pais
/*app.get(BASE_API_PATH + "/results/:country", function (request, response) {
    var country = request.params.country;
    if (!country) {
        console.log("WARNING: New GET request to /results/:country without name, sending 400...");
        response.sendStatus(400); // bad request
    } else {
        console.log("INFO: New GET request to /results/" + country);
        db.find({country:country}).toArray(function (err, results) {
            if (err) {
                console.error('WARNING: Error getting data from DB');
                response.sendStatus(500); // internal server error
            } else if (results.length > 0) { 
                    var result = results; //since we expect to have exactly ONE contact with this name
                    console.log("INFO: Sending result: " + JSON.stringify(result, 2, null));
                    response.send(result);
                } else {
                    console.log("WARNING: There are not any result with country " + country);
                    response.sendStatus(404); // not found
                
                }
        });
}
});

*/

// Get a un recurso concreto
app.get(BASE_API_PATH + "/results/:country/:year", function (request, response) {
    var country = request.params.country;
    var year = request.params.year;
    if (!country || !year) {
        console.log("WARNING: New GET request to /results/:country without name or without year, sending 400...");
        response.sendStatus(400); // bad request
    } else {
        console.log("INFO: New GET request to /results/" + country + "/" + year);
        dbRuben.find({country:country, $and:[{year:year}]}).toArray(function (err, results) {
            if (err) {
                console.error('WARNING: Error getting data from DB');
                response.sendStatus(500); // internal server error
            } else if (results.length > 0) { 
                    var result = results[0]; //since we expect to have exactly ONE contact with this name
                    console.log("INFO: Sending result: " + JSON.stringify(result, 2, null));
                    response.send(result);
                } else {
                    console.log("WARNING: There are not any country with name " + country +  "and year " + year);
                    response.sendStatus(404); // not found
                
                }
        });
}
});

//POST a una colección

app.post(BASE_API_PATH + "/results", function (request, response) {
    var newResult = request.body;
    if (!newResult) {
        console.log("WARNING: New POST request to /contacts/ without contact, sending 400...");
        response.sendStatus(400); // bad request
    } else {
        console.log("INFO: New POST request to /results with body: " + JSON.stringify(newResult, 2, null));
        if (!newResult.country || !newResult.year || !newResult.science || !newResult.math || !newResult.reading) {
            console.log("WARNING: The contact " + JSON.stringify(newResult, 2, null) + " is not well-formed, sending 422...");
            response.sendStatus(422); // unprocessable entity
        } else {
            dbRuben.find({country:newResult.country, $and:[{year:newResult.year}]}).toArray(function (err, results) {
                if (err) {
                    console.error('WARNING: Error getting data from DB');
                    response.sendStatus(500); // internal server error
                } else {
                    var resultsBeforeInsertion = results.filter((result) => {
                        return (result.country.localeCompare(result.country, "en", {'sensitivity': 'base'}) === 0);
                      
                      
                     
});

                    if (resultsBeforeInsertion.length > 0) {
                        console.log("WARNING: The result " + JSON.stringify(newResult, 2, null) + " already extis, sending 409...");
                        response.sendStatus(409); // conflict
                    } else {
                        console.log("INFO: Adding result " + JSON.stringify(newResult, 2, null));
                        dbRuben.insert(newResult);
                        response.sendStatus(201); // created
                    }
                }
            });
        }
    }
});


//Post a un recurso (PROHIBIDO)

app.post(BASE_API_PATH + "/results/:country/:year", function (request, response) {
    var country = request.params.country;
    var year = request.params.year;
    console.log("WARNING: New POST request to /country/" + country + " and year " + year + ", sending 405...");
    response.sendStatus(405); // method not allowed
});



//Put a una coleccion (Prohibido)
app.put(BASE_API_PATH + "/results", function (request, response) {
    console.log("WARNING: New PUT request to /results, sending 405...");
    response.sendStatus(405); // method not allowed
});


// Delete a un recurso concreto

app.delete(BASE_API_PATH + "/results/:country/:year", function (request, response) {
    var country = request.params.country;
    var year = request.params.year;
    if (!country || !year) {
        console.log("WARNING: New DELETE request to /contacts/:country/:year without country and year, sending 400...");
        response.sendStatus(400); // bad request
    } else {
        console.log("INFO: New DELETE request to /results/" + country + " and year " + year);
        dbRuben.remove({country:country, $and:[{year:year}]}, {}, function (err, numRemoved) {
            if (err) {
                console.error('WARNING: Error removing data from DB');
                response.sendStatus(500); // internal server error
            } else {
                console.log("INFO: Results removed: " + numRemoved);
                if (numRemoved === 1) {
                    console.log("INFO: The result with country " + country + "and year " + year + " has been succesfully deleted, sending 204...");
                    response.sendStatus(204); // no content
                } else {
                    console.log("WARNING: There are no countries to delete");
                    response.sendStatus(404); // not found
                }
            }
        });
    }
});


//PUT sobre un recurso concreto


app.put(BASE_API_PATH + "/results/:country/:year", function (request, response) {
    var updatedResult = request.body;
    var country = request.params.country;
    var year = request.params.year;
    if (!updatedResult) {
        console.log("WARNING: New PUT request to /results/ without result, sending 400...");
        response.sendStatus(400); // bad request
    } else {
        console.log("INFO: New PUT request to /results/" + country + " with data " + JSON.stringify(updatedResult, 2, null));
        if (!updatedResult.country || !updatedResult.year || !updatedResult.science || !updatedResult.math || !updatedResult.reading) {
            console.log("WARNING: The result " + JSON.stringify(updatedResult, 2, null) + " is not well-formed, sending 422...");
            response.sendStatus(422); // unprocessable entity
        } else {
            dbRuben.find({country:updatedResult.country, $and:[{year:updatedResult.year}]}).toArray(function (err, results) {
                if (err) {
                    console.error('WARNING: Error getting data from DB');
                    response.sendStatus(500); // internal server error
                } else if (results.length > 0) {
                        dbRuben.update({country: updatedResult.country, year: updatedResult.year}, updatedResult);
                        console.log("INFO: Modifying result with country " + country + " with data " + JSON.stringify(updatedResult, 2, null));
                        response.send(updatedResult); // return the updated contact
                    } else {
                        console.log("WARNING: There are not any result with country " + country);
                        response.sendStatus(404); // not found
                    }
                }
            )}
        }
    });

//DELETE a una coleccion
app.delete(BASE_API_PATH + "/results", function (request, response) {
    console.log("INFO: New DELETE request to /results");
    dbRuben.remove({}, {multi: true}, function (err, numRemoved) {
        if (err) {
            console.error('WARNING: Error removing data from DB');
            response.sendStatus(500); // internal server error
        } else {
            if (numRemoved > 0) {
                console.log("INFO: All the results (" + numRemoved + ") have been succesfully deleted, sending 204...");
                response.sendStatus(204); // no content
            } else {
                console.log("WARNING: There are no results to delete");
                response.sendStatus(404); // not found
            }
        }
    });
});



///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////CODIGO API RAUL/////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//Load Initial Data
app.get(BASE_API_PATH + "/earlyleavers/loadInitialData",function(request, response) {
    
    dbRaul.find({}).toArray(function(err,earlyleavers){
        
         if (err) {
        console.error('WARNING: Error while getting initial data from DB');
        return 0;
    }
    
      if (earlyleavers.length === 0) {
        console.log('INFO: Empty DB, loading initial data');

              var earlyleavers = [{
                "country": "Spain",
                "year": "2014",
                "eslmale": "25.6",
                "eslfemale": "18.1",
                "esltotal": "21.9",
                "eslobjective": "15"
            },
            {
                "country": "Spain",
                "year": "2015",
                "eslmale": "24",
                "eslfemale": "15.8",
                "esltotal": "20",
                "eslobjective": "15"
            },
            {
                "country": "France",
                "year": "2015",
                "eslmale": "10.1",
                "eslfemale": "8.5",
                "esltotal": "9.3",
                "eslobjective": "9.5"
            }];
        
    dbRaul.insert(earlyleavers);
      } else {
        console.log('INFO: DB has ' + earlyleavers.length + ' objects ');
    }
});
});

//Base GET
app.get("/", function (request, response) {
    console.log("INFO: Redirecting to /earlyleavers");
    response.redirect(301, BASE_API_PATH + "/earlyleavers");
});


// GET a collection
app.get(BASE_API_PATH + "/earlyleavers", function (request, response) {
    
    console.log("INFO: New GET request to /earlyleavers");
    dbRaul.find({}).toArray(function (err, earlyleavers) {
        if (err) {
            console.error('WARNING: Error getting data from DB');
            response.sendStatus(500); // internal server error
        } else {
            console.log("INFO: Sending earlyleavers: " + JSON.stringify(earlyleavers, 2, null));
            response.send(earlyleavers);
        }
    });
});

// GET a collection de un mismo año 

app.get(BASE_API_PATH + "/earlyleavers/:year", function (request, response) {
    var year = request.params.year;
    var country = request.params.year;

    if(isNaN(request.params.year.charAt(0))){
        

            if (!country) {
        console.log("WARNING: New GET request to /earlyleavers/:country without name, sending 400...");
        response.sendStatus(400); // bad request
    } else {
        console.log("INFO: New GET request to /earlyleavers/" + country);
        dbRaul.find({country:country}).toArray(function (err, earlyleavers) {
            if (err) {
                console.error('WARNING: Error getting data from DB');
                response.sendStatus(500); // internal server error
            } else if (earlyleavers.length > 0) { 
                    var earlyleaver = earlyleavers; //since we expect to have exactly ONE contact with this name
                    console.log("INFO: Sending earlyleaver: " + JSON.stringify(earlyleaver, 2, null));
                    response.send(earlyleaver);
                } else {
                    console.log("WARNING: There are not any earlyleaver with country " + country);
                    response.sendStatus(404); // not found
                
                }
        });

}
    }else{

    if (!year) {
        console.log("WARNING: New GET request to /earlyleavers/:year without year, sending 400...");
        response.sendStatus(400); // bad request
    } else {
        console.log("INFO: New GET request to /earlyleavers/" + year);
        dbRaul.find({year:year}).toArray(function (err, earlyleavers) {
            if (err) {
                console.error('WARNING: Error getting data from DB');
                response.sendStatus(500); // internal server error
            } else if (earlyleavers.length > 0) { 
                    var earlyleaver = earlyleavers; //since we expect to have exactly ONE contact with this name
                    console.log("INFO: Sending result: " + JSON.stringify(earlyleaver, 2, null));
                    response.send(earlyleaver);
                } else {
                    console.log("WARNING: There are not any earlyleaver with year " + year);
                    response.sendStatus(404); // not found
                
                }
        });
}
    
}});


// Get a un recurso concreto
app.get(BASE_API_PATH + "/earlyleavers/:country/:year", function (request, response) {
    var country = request.params.country;
    var year = request.params.year;
    if (!country || !year) {
        console.log("WARNING: New GET request to /earlyleavers/:country without name or without year, sending 400...");
        response.sendStatus(400); // bad request
    } else {
        console.log("INFO: New GET request to /earlyleavers/" + country + "/" + year);
        dbRaul.find({country:country, $and:[{year:year}]}).toArray(function (err, earlyleavers) {
            if (err) {
                console.error('WARNING: Error getting data from DB');
                response.sendStatus(500); // internal server error
            } else if (earlyleavers.length > 0) { 
                    var earlyleaver = earlyleavers[0]; //since we expect to have exactly ONE contact with this name
                    console.log("INFO: Sending earlyleaver: " + JSON.stringify(earlyleaver, 2, null));
                    response.send(earlyleaver);
                } else {
                    console.log("WARNING: There are not any earlyleaver with country " + country +  "and year " + year);
                    response.sendStatus(404); // not found
                
                }
        });
}
});

//POST a una colección

app.post(BASE_API_PATH + "/earlyleavers", function (request, response) {
    var newEarlyleaver = request.body;
    if (!newEarlyleaver) {
        console.log("WARNING: New POST request to /earlyleavers/ without earlyleaver, sending 400...");
        response.sendStatus(400); // bad request
    } else {
        console.log("INFO: New POST request to /earlyleavers with body: " + JSON.stringify(newEarlyleaver, 2, null));
        if (!newEarlyleaver.country || !newEarlyleaver.year || !newEarlyleaver.eslmale || !newEarlyleaver.eslfemale || !newEarlyleaver.esltotal || !newEarlyleaver.eslobjective) {
            console.log("WARNING: The earlyleaver " + JSON.stringify(newEarlyleaver, 2, null) + " is not well-formed, sending 422...");
            response.sendStatus(422); // unprocessable entity
        } else {
            dbRaul.find({country:newEarlyleaver.country, $and:[{year:newEarlyleaver.year}]}).toArray(function (err, earlyleavers) {
                if (err) {
                    console.error('WARNING: Error getting data from DB');
                    response.sendStatus(500); // internal server error
                } else {
                    var earlyleaversBeforeInsertion = earlyleavers.filter((earlyleaver) => {
                        return (earlyleaver.country.localeCompare(earlyleaver.country, "en", {'sensitivity': 'base'}) === 0);
                      
                      
                     
});

                    if (earlyleaversBeforeInsertion.length > 0) {
                        console.log("WARNING: The earlyleaver " + JSON.stringify(newEarlyleaver, 2, null) + " already extis, sending 409...");
                        response.sendStatus(409); // conflict
                    } else {
                        console.log("INFO: Adding earlyleaver " + JSON.stringify(newEarlyleaver, 2, null));
                        dbRaul.insert(newEarlyleaver);
                        response.sendStatus(201); // created
                    }
                }
            });
        }
    }
});


//Post a un recurso (PROHIBIDO)

app.post(BASE_API_PATH + "/earlyleavers/:country/:year", function (request, response) {
    var country = request.params.country;
    var year = request.params.year;
    console.log("WARNING: New POST request to /earlyleavers/" + country + " and year " + year + ", sending 405...");
    response.sendStatus(405); // method not allowed
});



//Put a una coleccion (Prohibido)
app.put(BASE_API_PATH + "/earlyleavers", function (request, response) {
    console.log("WARNING: New PUT request to /earlyleavers, sending 405...");
    response.sendStatus(405); // method not allowed
});


// Delete a un recurso concreto

app.delete(BASE_API_PATH + "/earlyleavers/:country/:year", function (request, response) {
    var country = request.params.country;
    var year = request.params.year;
    if (!country || !year) {
        console.log("WARNING: New DELETE request to /earlyleavers/:country/:year without country and year, sending 400...");
        response.sendStatus(400); // bad request
    } else {
        console.log("INFO: New DELETE request to /earlyleavers/" + country + " and year " + year);
        dbRaul.remove({country:country, $and:[{year:year}]}, {}, function (err, numRemoved) {
            if (err) {
                console.error('WARNING: Error removing data from DB');
                response.sendStatus(500); // internal server error
            } else {
                console.log("INFO: Earlyleavers removed: " + numRemoved);
                if (numRemoved === 1) {
                    console.log("INFO: The earlyleavers with country " + country + "and year " + year + " has been succesfully deleted, sending 204...");
                    response.sendStatus(204); // no content
                } else {
                    console.log("WARNING: There are no countries to delete");
                    response.sendStatus(404); // not found
                }
            }
        });
    }
});


//PUT sobre un recurso concreto


app.put(BASE_API_PATH + "/earlyleavers/:country/:year", function (request, response) {
    var updatedEarlyleaver = request.body;
    var country = request.params.country;
    var year = request.params.year;
    if (!updatedEarlyleaver) {
        console.log("WARNING: New PUT request to /earlyleavers/ without earlyleaver, sending 400...");
        response.sendStatus(400); // bad request
    } else {
        console.log("INFO: New PUT request to /earlyleavers/" + country + " with data " + JSON.stringify(updatedEarlyleaver, 2, null));
        if (!updatedEarlyleaver.country || !updatedEarlyleaver.year || !updatedEarlyleaver.eslmale || !updatedEarlyleaver.eslfemale || !updatedEarlyleaver.esltotal || !updatedEarlyleaver.eslobjective) {
            console.log("WARNING: The earlyleaver " + JSON.stringify(updatedEarlyleaver, 2, null) + " is not well-formed, sending 422...");
            response.sendStatus(422); // unprocessable entity
        } else {
            dbRaul.find({country:updatedEarlyleaver.country, $and:[{year:updatedEarlyleaver.year}]}).toArray(function (err, earlyleavers) {
                if (err) {
                    console.error('WARNING: Error getting data from DB');
                    response.sendStatus(500); // internal server error
                } else if (earlyleavers.length > 0) {
                        dbRaul.update({country: updatedEarlyleaver.country, year: updatedEarlyleaver.year}, updatedEarlyleaver);
                        console.log("INFO: Modifying earlyleaver with country " + country + " with data " + JSON.stringify(updatedEarlyleaver, 2, null));
                        response.send(updatedEarlyleaver); // return the updated contact
                    } else {
                        console.log("WARNING: There are not any earlyleavers with country " + country);
                        response.sendStatus(404); // not found
                    }
                }
            )}
        }
    });

//DELETE a una coleccion
app.delete(BASE_API_PATH + "/earlyleavers", function (request, response) {
    console.log("INFO: New DELETE request to /earlyleavers");
    dbRaul.remove({}, {multi: true}, function (err, numRemoved) {
        if (err) {
            console.error('WARNING: Error removing data from DB');
            response.sendStatus(500); // internal server error
        } else {
            if (numRemoved > 0) {
                console.log("INFO: All the earlyleavers (" + numRemoved + ") have been succesfully deleted, sending 204...");
                response.sendStatus(204); // no content
            } else {
                console.log("WARNING: There are no earlyleavers to delete");
                response.sendStatus(404); // not found
            }
        }
    });
});


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////CODIGO API IVAN/////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////







