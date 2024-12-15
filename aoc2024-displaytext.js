finaldisplay = ""

function displayText(text) {
    $(function(){   
        console.log(text)

        if (Array.isArray(text)) {
            text = text.join('<span class="comma">,</span><br>')
        }

        text = '<div class="row">' + text + '</div>'
        
        finaldisplay += text

        $('#result').html(finaldisplay);
        
    })
}

function counter(a, b) {
    $(function(){
        $('#counter').text(a + b)
    })
}

function clearBoard() {
    finaldisplay = ""
}