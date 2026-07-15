const SUN_ALT_AT_SET = -0.833;
function toRad(d){ return d*Math.PI/180; }
function toDeg(r){ return r*180/Math.PI; }
function declinationCooper(N){ return 23.45*Math.sin(toRad((360/365)*(284+N))); }
function declinationSpencer(N) {
  const gamma = 2*Math.PI*(N-1)/365;
  const D = 0.006918
    - 0.399912*Math.cos(gamma) + 0.070257*Math.sin(gamma)
    - 0.006758*Math.cos(2*gamma) + 0.000907*Math.sin(2*gamma)
    - 0.002697*Math.cos(3*gamma) + 0.001480*Math.sin(3*gamma);
  return D * 180/Math.PI; // แปลงเรเดียนเป็นองศา
}
function getDeclination(N, method) {
  return method === 'spencer' ? declinationSpencer(N) : declinationCooper(N);
}
const FORMULA_LABEL = { cooper: 'Cooper, 1969', spencer: 'Spencer, 1971' };
function fmtThai(d){
  const months = ['ม.ค.','ก.พ.','มี.ค.','เม.ย.','พ.ค.','มิ.ย.','ก.ค.','ส.ค.','ก.ย.','ต.ค.','พ.ย.','ธ.ค.'];
  return d.getDate() + ' ' + months[d.getMonth()] + ' ' + (d.getFullYear()+543);
}
