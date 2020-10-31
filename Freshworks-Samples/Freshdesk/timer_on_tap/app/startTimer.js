document.addEventListener('DOMContentLoaded', function() {
  console.log("Dom completed");
  q('#startTimer').disabled = false;
  hide(qAll('.alert'));
  show(q('.spinner'));
  hide(q('#fields'));

  app.initialized().then(function(_client) {
    window._client = _client;
    var baseUrl = `https://<%= iparam.freshdesk_domain %>.freshdesk.com`;
    var url = `${baseUrl}/api/v2/agents`;
    var options = {
      "headers" : {
        "Content-Type": "application/json",
        "Authorization": "Basic <%= encode(iparam.freshdesk_key + ':x') %>"
      }
    };
    _client.request.get(url, options)
    .then(function(data) {
      console.log("Client request got");
      console.log(data);
      if (data.status === 200) {
        var agentList = JSON.parse(data.response);
        const agent = q('#agent');
        const options = agentList
          .map(agent => `<option value="${agent.id}">${agent.contact.name}</option>`)
          .join('');
        agent.innerHTML += options;
        hide(q('.spinner'));
        show(q('#fields'));
      }
      else {
        console.log(`${error} in client request`);
        hide(q('.spinner'));
        show(q('.alert-danger'));
      }
    }, function(error) {
      console.log(`${error} in client request`);
      hide(q('.spinner'));
      show(q('.alert-danger'));
    });
  });
});

/**
 * Handles upon clicking the start timer icon
 */

function addTimer() {
  var agent = q('#agent').value;
  var billable = q('#billable').checked;
  var note = q('#note').value;
  _client.instance.send({ message: { agent, billable, note } });
  show(q('.alert-success'));
  q('#startTimer').disabled = true;
}

function qAll(selector) {
  return document.querySelectorAll(selector);
}

function q(selector) {
  return document.querySelector(selector);
}

function hide(element) {
  if(element instanceof NodeList) {
    element.forEach(e => { 
      e.style.display = 'none';
    });
  }
  else {
    element.style.display = 'none';
  }
}

function show(element) {
  element.style.display = '';
}
