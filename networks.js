// Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
// 'IPv4' is in Node <= 17, from 18 it's a number 4 or 6
const { networkInterfaces } = require('os');
const fu = name => networkInterfaces()[name]?.find(x => (x.family == "IPv4" || x.family == 4) && x.internal == false)
module.exports = {
    get wifi() {return fu("Wi-Fi")},
    get lan() {return fu("eth0")} //not sure on windows vs mac (think mac is en0)
}

/* networkInterfaces() Example

{
  "Wi-Fi": [
    {
      "address": "fe80::20db:5202:7ab3:407d",
      "netmask": "ffff:ffff:ffff:ffff::",
      "family": "IPv6",
      "mac": "7c:50:79:59:b7:26",
      "internal": false,
      "cidr": "fe80::20db:5202:7ab3:407d/64",
      "scopeid": 9
    },
    {
      "address": "192.168.50.109",
      "netmask": "255.255.255.0",
      "family": "IPv4",
      "mac": "7c:50:79:59:b7:26",
      "internal": false,
      "cidr": "192.168.50.109/24"
    }
  ],
  "Loopback Pseudo-Interface 1": [
    {
      "address": "::1",
      "netmask": "ffff:ffff:ffff:ffff:ffff:ffff:ffff:ffff",
      "family": "IPv6",
      "mac": "00:00:00:00:00:00",
      "internal": true,
      "cidr": "::1/128",
      "scopeid": 0
    },
    {
      "address": "127.0.0.1",
      "netmask": "255.0.0.0",
      "family": "IPv4",
      "mac": "00:00:00:00:00:00",
      "internal": true,
      "cidr": "127.0.0.1/8"
    }
  ]
}


*/

//.find({family: 'IPv4', internal: false})