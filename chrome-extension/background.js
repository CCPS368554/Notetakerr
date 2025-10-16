// Handles API requests and stores notes
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'processText') {
    // Use Chrome Prompt API for summarization, elaboration, and proofreading
    const prompts = [
      {role: 'user', content: `Summarize: ${request.text}`},
      {role: 'user', content: `Elaborate: ${request.text}`},
      {role: 'user', content: `Proofread: ${request.text}`}
    ];
    Promise.all(prompts.map(prompt =>
      chrome.prompt.sendPrompt({messages: [prompt], model: 'gemini-pro'})
    )).then(([summaryRes, elaborationRes, proofreadRes]) => {
      const result = {
        summary: summaryRes.candidates?.[0]?.content || '',
        elaboration: elaborationRes.candidates?.[0]?.content || '',
        proofread: proofreadRes.candidates?.[0]?.content || ''
      };
      chrome.storage.local.get({notes: []}, (data) => {
        const notes = data.notes;
        notes.push({
          original: request.text,
          ...result,
          timestamp: Date.now()
        });
        chrome.storage.local.set({notes});
        sendResponse(result);
      });
    }).catch(err => {
      sendResponse({error: err.message});
    });
    return true;
  }
});
