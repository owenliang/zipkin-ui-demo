[
    {
        "_index" : "zipkin:span-2017-11-12",
        "_type" : "span",
        "_id" : "AV-wXowio-47v8n2AYke",
        "_score" : 2.5389738,
        "_source" : {
            "traceId" : "00055dc8f14d83e5",
            "duration" : 220529,
            "localEndpoint" : {
                "serviceName" : "a.service.com",
                "ipv4" : "192.168.1.100",
                "port" : 80
            },
            "debug" : true,
            "timestamp_millis" : 1510492506784,
            "kind" : "CLIENT",
            "name" : "/method_of_b",
            "id" : "00055dc8f14d8492",
            "parentId" : "00055dc8f14d848e",
            "timestamp" : 1510492506784916,
            "tags" : {
                "queryParams" : "e=1&f=2&g=3"
            }
        }
    },
    {
        "_index" : "zipkin:span-2017-11-12",
        "_type" : "span",
        "_id" : "AV-wXowio-47v8n2AYkf",
        "_score" : 1.6739764,
        "_source" : {
            "traceId" : "00055dc8f14d83e5",
            "debug" : true,
            "timestamp_millis" : 1510492507005,
            "kind" : "CLIENT",
            "parentId" : "00055dc8f14d848e",
            "tags" : {
                "sql" : "select * from user;"
            },
            "duration" : 104228,
            "remoteEndpoint" : {
                "serviceName" : "mysql.service.com"
            },
            "localEndpoint" : {
                "serviceName" : "a.service.com",
                "ipv4" : "192.168.1.100",
                "port" : 80
            },
            "name" : "mysql.user",
            "id" : "00055dc8f150e217",
            "timestamp" : 1510492507005467
        }
    },
    {
        "_index" : "zipkin:span-2017-11-12",
        "_type" : "span",
        "_id" : "AV-wXot9o-47v8n2AYkd",
        "_score" : 1.2809339,
        "_source" : {
            "traceId" : "00055dc8f14d83e5",
            "duration" : 205077,
            "shared" : true,
            "localEndpoint" : {
                "serviceName" : "b.service.com",
                "ipv4" : "192.168.1.200",
                "port" : 80
            },
            "debug" : true,
            "timestamp_millis" : 1510492506784,
            "kind" : "SERVER",
            "name" : "/method_of_b",
            "id" : "00055dc8f14d8492",
            "parentId" : "00055dc8f14d848e",
            "timestamp" : 1510492506784916
        }
    },
    {
        "_index" : "zipkin:span-2017-11-12",
        "_type" : "span",
        "_id" : "AV-wXowio-47v8n2AYkg",
        "_score" : 1.2809339,
        "_source" : {
            "traceId" : "00055dc8f14d83e5",
            "duration" : 378788,
            "localEndpoint" : {
                "serviceName" : "a.service.com",
                "ipv4" : "192.168.1.100",
                "port" : 80
            },
            "debug" : true,
            "timestamp_millis" : 1510492506784,
            "kind" : "SERVER",
            "name" : "/method_of_a",
            "id" : "00055dc8f14d848e",
            "timestamp" : 1510492506784911,
            "tags" : {
                "queryParams" : "a=1&b=2&c=3"
            }
        }
    }
]