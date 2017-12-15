$.getScript("data.js", function (response, status) {
    var traceData = eval(response)

    // 原始Elasticsearch记录
    console.log(traceData)

    // 1, 按span id聚合client和server日志
    var spanMap = {}
    for (var i = 0; i < traceData.length; ++i) {
        var spanId = traceData[i]._source.id
        if (spanMap[spanId] === undefined) {
            spanMap[spanId] = {}
        }
        var spanKind = traceData[i]._source.kind
        spanMap[spanId][spanKind] = traceData[i]._source
    }
    console.log(spanMap)

    // 2, 为每个span聚合client与server日志（TODO:需要校验数据合法性）
    var allSpans = []
    for (var spanId in spanMap) {
        var spanPair = spanMap[spanId]
        var clientSpan = spanPair["CLIENT"]
        var serverSpan = spanPair["SERVER"]

        var mergedSpan = {}

        // TRACE ID
        mergeValue(mergedSpan, "traceId", clientSpan, "traceId", serverSpan, "traceId")
        // SPAN ID
        mergedSpan["id"] = spanId
        // 父SPAN ID
        mergeValue(mergedSpan, "parentId", clientSpan, "parentId", serverSpan, "parentId")
        // RPC名称
        mergeValue(mergedSpan, "name", clientSpan, "name", serverSpan, "name")
        // RPC调用方
        mergeValue(mergedSpan, "from", clientSpan, "localEndpoint", serverSpan, "remoteEndpoint")
        // RPC被调用方
        mergeValue(mergedSpan, "to", clientSpan, "remoteEndpoint", serverSpan, "localEndpoint")
        // RPC客户端发出时间(cs)
        mergeValue(mergedSpan, "cs", clientSpan, "timestamp")
        // RPC服务端收到时间(sr)
        mergeValue(mergedSpan, "sr", serverSpan, "timestamp")
        // RPC客户端处理时间(cDuration)
        mergeValue(mergedSpan, "cDuration", clientSpan, "duration")
        // RPC服务端处理时间(sDuration)
        mergeValue(mergedSpan, "sDuration", serverSpan, "duration")

        allSpans.push(mergedSpan)
    }
    console.log(allSpans)

    // 3, 找出root span（没有parentId的）
    var rootSpan
    for (var i = 0; i < allSpans.length; ++i) {
        var span = allSpans[i]
        if (span.parentId === undefined) {
            rootSpan = span
            break
        }
    }
    console.log(rootSpan)

    // 4, 将span按parentId索引
    var parentIndex = {}
    for (var i = 0; i < allSpans.length; ++i) {
        var span = allSpans[i]
        if (span === rootSpan) {
            continue
        }
        if (parentIndex[span.parentId] === undefined) {
            parentIndex[span.parentId] = []
        }
        parentIndex[span.parentId].push(span)
    }
    console.log(parentIndex)

    // 5, 从root span开始，广度优先，建立调用链
    var treeRoot = {span: rootSpan, children: []}
    var stack = [treeRoot]
    while (stack.length) {
        var node = stack.shift()
        if (parentIndex[node.span.id]) {
            var children = parentIndex[node.span.id]
            // TODO: 按cs排序
            for (var i = 0; i < children.length; ++i) {
                var childNode = {span: children[i], children: []}
                node.children.push(childNode)
                stack.push(childNode)
            }
        }
    }
    console.log(treeRoot)

    // 6, 深度优先遍历调用树（递归实现简单点），打印调用关系
    function formatTree(node, rows, depth = 0) {
        var nestedRPC = ""
        for (var i = 0; i < depth; ++i) {
            nestedRPC += "+"
        }
        nestedRPC += node.span.name

        var row = {
            showName: nestedRPC,
            duration: node.span.cDuration ? node.span.cDuration : node.span.sDuration,
            startTime: node.span.cs ? node.span.cs : node.span.sr,
        }
        rows.push(row)

        for (var i = 0; i < node.children.length; ++i) {
            formatTree(node.children[i], rows, depth + 1)
        }
    }
    var rows = []
    formatTree(treeRoot, rows)
    console.log(rows)

    // 7，计算每一行的占比宽度，输出HTML
    for (var i = 0; i < rows.length; ++i) {
        var width = rows[i].duration * 1.0 / rootSpan.sDuration * 100
        var marginLeft = (rows[i].startTime - rootSpan.sr) / rootSpan.sDuration * 100
        $("#span-list").append($("<li></li>").html(rows[i].showName))
        $("#duration-list").append($("<li></li>").html(rows[i].duration).css("width", width + "%").css("margin-left", marginLeft + "%"))
    }

    // 聚合工具函数
    function mergeValue(dest, destKey, left, leftKey, right, rightKey) {
        var leftValue
        if (left !== undefined && leftKey !== undefined && left[leftKey] !== undefined) {
            leftValue = left[leftKey]
        }
        var rightValue
        if (right !== undefined && rightKey !== undefined && right[rightKey] !== undefined) {
            rightValue = right[rightKey]
        }
        var value = (leftValue !== undefined ? leftValue : rightValue)
        if (value !== undefined) {
            dest[destKey] = value
        }
    }
})