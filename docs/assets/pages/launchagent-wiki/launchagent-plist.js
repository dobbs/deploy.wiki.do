function plist ({wikipath, datapath}) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>Label</key>
  <string>localhost.wiki</string>
  <key>ProgramArguments</key>
  <array>
    <string>${wikipath}/wiki</string>
    <string>--config</string>
    <string>${datapath}/config.json</string>
  </array>
  <key>EnvironmentVariables</key>
  <dict>
    <key>PATH</key>
    <string>${wikipath}:/usr/local/bin:/usr/bin:/bin</string>
  </dict>
  <key>WorkingDirectory</key>
  <string>${datapath}</string>
  <key>RunAtLoad</key>
  <true/>
  <key>StandardOutPath</key>
  <string>${datapath}/stdout.txt</string>
  <key>StandardErrorPath</key>
  <string>${datapath}/stderr.txt</string>
  <key>inetdCompatibility</key>
  <dict>
    <key>Wait</key>
    <false/>
  </dict>
</dict>
</plist>`
}

if (import.meta.main && Deno) {
  const wikipath = Deno.env.get("NVM_BIN")
  const datapath = `${Deno.env.get("HOME")}/.wiki`
  console.log(plist({wikipath, datapath}))
}
