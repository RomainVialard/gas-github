'use strict';
function getId() {
  const match = window.location.href.match(/https:\/\/script\.google\.com(.*?)\/home\/projects\/([^/]*)\//);
  if (!match) return null;
  return match[2];
}

function getRepo() {
  return context.bindRepo[getId()];
}

function getBranch() {
  return context.bindBranch[getId()];
}

function getConfig() {
  let config = context.bindConfig[getId()];
  if (!config) {
    config = {
      filetype: '.gs',
      ignorePattern: [],
      manifestEnabled: true,
    }
  }
  return config;
}

function isGist() {
  const repo = getRepo();
  if(repo) {
    return repo.gist;
  }
  return false;
}

function getAllItems(promise, followMethod, type) {
  return promise.then(followMethod)
    .then((data) => {
      return data.url ? getAllItems(Promise.resolve(data), followMethod, type) : data.items;
    });
}

function createSCM(item) {
  switch (item.scm) {
    case 'github':
      return new Github(item.baseUrl, item.user, item.token);
    case 'bitbucket':
      return new Bitbucket(item.baseUrl, item.user, item.token);
    case 'gitlab':
      return new Gitlab(item.baseUrl, item.user, item.token);
    default:
      return new Github(item.baseUrl, item.user, item.token);
  }
}

function getGitHubJSON(url, accessToken, data) {
  return $.ajax({
    url: url,
    headers: {
      'Authorization': `token ${accessToken}`
    },
    method: 'GET',
    crossDomain: true,
    dataType: 'json',
    data: data,
    contentType: 'application/json'
  })
}