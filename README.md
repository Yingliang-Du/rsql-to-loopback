# Node RSQL / FIQL Parser
## Gratitute
Without GOD's blessing, I am not able to do anything useful!  
Thanks to Prashanth Ponugoti and Kameswara Eati for their guidance, inspiration and contribution.

## Overview
[RSQL](https://github.com/jirutka/rsql-parser) (RESTful Service Query Language) is an extention of apache's [FIQL](http://tools.ietf.org/html/draft-nottingham-atompub-fiql-00) (Feed Item Query Language). It is very simple and yet capable to express complex queries within a HTTP URI string. It is very well adopted as a generic query language for searching RESTful service endpoints.  
An open source implementation convert RSQL to [LoopBack queries](https://docs.strongloop.com/display/public/LB/Querying+data) for [LoopBack Framework](https://loopback.io/). Providing this adapater for LoopBack queries makes RSQL a natural choice for query RESTful APIs that backended with LoopBack models.

## HowTos
```
// import RSQL to LoopBack model
var rsql2Loopback = require('rsql-to-loopback');

// convert RSQL string to LoopBack query where clause
rsql2Loopback(rsqlString);
```

## Examples
This project convert RSQL query to where clouse of LoopBack query:

```
# basic equality
firstName==John -> 
{
    "where": {
        "firstName": "John"
    }
}

# basic inequality
firstName!=John -> 
{
    "where": {
        "firstName": {
            "neq": "John"
        }
    }
}

# basic greater than
createDate>'2016-01-01' -> 
createDate=gt='2016-01-01' -> 
{
    "where": {
        "createDate": {
            "gt": "2016-01-01"
        }
    }
}

# basic greater than or equal
createDate>='2016-01-01' -> 
createDate=ge='2016-01-01' -> 
{
    "where": {
        "createDate": {
            "gte": "2016-01-01"
        }
    }
}

# basic less than
createDate<'2016-06-06' ->
createDate=lt='2016-06-06' -> 
{
    "where": {
        "createDate": {
            "lt": "2016-06-06"
        }
    }
}

# basic less than or equal
createDate<='2016-06-06' ->
createDate=le='2016-06-06' -> 
{
    "where": {
        "createDate": {
            "lte": "2016-06-06"
        }
    }
}

# basic element appears in list
firstName=in=(John, Vincent, Melissa) -> 
{
    "where": {
        "firstName": {
            "inq": [
                "John",
                "Vincent",
                "Melissa"
            ]
        }
    }
}

# basic element does not appear in list
firstName=out=(John, Vincent, Melissa) -> 
{
    "where": {
        "firstName": {
            "nin": [
                "John",
                "Vincent",
                "Melissa"
            ]
        }
    }
}

# anding of two basic conditions
firstName!=Joe;lastName==Dummy -> 
{
    "where": {
        "and": [
            {
                "firstName": {
                    "neq": "Joe"
                }
            },
            {
                "lastName": "Dummy"
            }
        ]
    }
}

# oring of two basic conditions
firstName!=John,lastName==Dude -> 
{
    "where": {
        "or": [
            {
                "firstName": {
                    "neq": "John"
                }
            },
            {
                "lastName": "Dude"
            }
        ]
    }
}

# anding of two oring conditions of anding conditions
((firstName==John;lastName==Duoe),(firstName==Aaron;lastName==Yuarter));((age==25;height==5ft),(age==30;height==6ft)) -> 
{
    "where": {
        "and": [
            {
                "or": [
                    {
                        "and": [
                            {
                                "firstName": "John"
                            },
                            {
                                "lastName": "Duoe"
                            }
                        ]
                    },
                    {
                        "and": [
                            {
                                "firstName": "Aaron"
                            },
                            {
                                "lastName": "Yuarter"
                            }
                        ]
                    }
                ]
            },
            {
                "or": [
                    {
                        "and": [
                            {
                                "age": "25"
                            },
                            {
                                "height": "5ft"
                            }
                        ]
                    },
                    {
                        "and": [
                            {
                                "age": "30"
                            },
                            {
                                "height": "6ft"
                            }
                        ]
                    }
                ]
            }
        ]
    }
}    
```

## License

This project is licensed under [MIT license](http://opensource.org/licenses/MIT).

