const tap = (fn) => (data) => {
  fn(data);
  return data;
}

function logJson(data) {
  console.log(JSON.stringify(data));
}
