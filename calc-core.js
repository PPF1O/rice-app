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

// ปุ่มดึงพิกัด GPS — ใช้ร่วมกันทั้ง photoperiod_calculator.html (สถานะออกที่ #lat-status)
// และ planting_predictor.html (สถานะออกที่ #gps-status) แล้วเรียก calculate()/predict() ตามหน้าที่มีจริง
function fetchGPS(){
  const statusEl = document.getElementById('lat-status') || document.getElementById('gps-status');
  const btn = document.querySelector('.gps-btn');
  const isLatStatus = statusEl && statusEl.id === 'lat-status';

  if (!navigator.geolocation){
    if (statusEl){
      statusEl.textContent = '⚠ อุปกรณ์นี้ไม่รองรับ GPS — กรุณากรอกละติจูดเอง';
      if (isLatStatus) statusEl.className = 'lat-status changed';
    }
    return;
  }

  if (statusEl){
    statusEl.textContent = 'กำลังค้นหาตำแหน่ง... (กรุณาอนุญาตการเข้าถึงตำแหน่ง)';
    if (isLatStatus) statusEl.className = 'lat-status changed';
  }
  if (btn) btn.disabled = true;

  navigator.geolocation.getCurrentPosition(
    function(pos){
      const lat = pos.coords.latitude;
      const lon = pos.coords.longitude;
      document.getElementById('lat').value = lat.toFixed(4);

      // หน้า photoperiod_calculator.html: อัปเดต hint ตามปกติก่อน แล้วค่อยเขียนทับด้วยข้อความยืนยัน GPS
      if (isLatStatus && typeof updateLatHint === 'function') updateLatHint();

      if (statusEl){
        statusEl.textContent = '✓ ได้พิกัดแล้ว: ' + lat.toFixed(4) + '°N, ' + lon.toFixed(4) + '°E';
        if (isLatStatus) statusEl.className = 'lat-status changed';
      }
      if (btn) btn.disabled = false;

      if (typeof calculate === 'function') calculate();
      else if (typeof predict === 'function') predict();
    },
    function(err){
      const msgs = {
        1: '⚠ ถูกปฏิเสธการเข้าถึงตำแหน่ง — กรุณาอนุญาตในเบราว์เซอร์ หรือกรอกละติจูดเอง',
        2: '⚠ หาตำแหน่งไม่ได้ — ตรวจสอบว่าเปิด GPS อยู่ หรือกรอกละติจูดเอง',
        3: '⚠ ใช้เวลานานเกินไป — ลองใหม่ หรือกรอกละติจูดเอง'
      };
      if (statusEl){
        statusEl.textContent = msgs[err.code] || '⚠ เกิดข้อผิดพลาด — กรุณากรอกละติจูดเอง';
        if (isLatStatus) statusEl.className = 'lat-status changed';
      }
      if (btn) btn.disabled = false;
    },
    { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
  );
}
