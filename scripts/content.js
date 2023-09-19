(() => {
    function addButtons() {
        let d = document.querySelectorAll("div[data-params]");
        for(var i in d) if(d.hasOwnProperty(i)) {
            let btn = document.createElement('div');
            let ans = document.createElement('ans');
            ans.classList.add('answer');
            btn.classList.add('btn');
            btn.innerHTML = "<img src='"+chrome.runtime.getURL('images/white.png')+"'><div>FormGini</div>"
            let dx = d[i].getAttribute('data-params');
            btn.addEventListener('click', async function() {
                const apiKey = '';
                chrome.storage.sync.get(["apikey"], function(items){
                    if(items && items != {} && items.apikey != undefined) {
                        apikey = items.apikey;
                    }else{
                        alert('FormGini: Please set your API Key...');
                        // let internalUrl = chrome.runtime.getURL("views/onboarding.html");
                    }
                });
                const apiUrl = 'https://api.openai.com/v1/engines/text-davinci-003/completions'; // Endpoint for ChatGPT
                const data = {
                    prompt: `Parse the question and suggest the prefect answer, ${JSON.stringify(parseData(dx))} in few words`,
                    max_tokens: 50, // Adjust the length of the generated article
                };
                const response = await fetch(apiUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${apiKey}`,
                    },
                    body: JSON.stringify(data),
                });

                if (response.ok) {
                    const result = await response.json();
                    const generatedText = result.choices[0].text;
                    // generatedText.replace(/"([^"]+)"/g, '<b>$1</b>');
                    ans.innerHTML = generatedText;
                }else{
                    alert('FormGini: Invalid API Key or Balance Exhausted... please set new api key')
                }
                // console.log(data)
            })
            $(d[i]).children("div").append(btn);
            $(d[i]).children("div").append(ans);
        }
    }

    function parseData(data) {
        const replaced = data.replace(/&quot;/gm, '"').replace('%.@.', '').replace(/,null/gm, '');
        var result = replaced.match(/(?<=(["']\b))(?:(?=(\\?))\2.)*?(?=\1)/gm);
        let l = [];
        result.map((d) => {
            l.push(d.replace('\\"'))
        })
        console.log(l)
        return replaced
    }

    // alert("Hello World")
    // alert(parseData(`%.@.[26209265,&quot;Which statement represents Newton's first law of motion?&quot;,null,1,[[1002432330,[],false,[],[],null,null,null,null,null,[null,[]]]],null,null,null,[],null,null,[null,&quot;\u003cspan\u003eWhich statement represents Newton's first law of motion?\u003c/span\u003e\u003cbr\u003e&quot;]],&quot;i17&quot;,&quot;i18&quot;,&quot;i19&quot;,false]`))
    addButtons()
})()

// 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