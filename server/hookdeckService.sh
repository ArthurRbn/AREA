#!/usr/bin/expect -f

set timeout -1

set api [lindex $argv 0]
set path [lindex $argv 1]
set envname [string toupper ${api}]

spawn hookdeck listen 8080 "${api}-api"

expect {
  "*Webhook URL:*" {
    expect eof
  }

  "What path should the webhooks be forwarded to (ie: /webhooks)?" {
    send "${path}\n"

    expect "What's your connection label (ie: My API)?"
    send "${api}-area\n"

    expect {
      -re  "(Webhook URL.{60})" {
        set webhook $expect_out(1,string)

        set url [string trimleft $webhook "Webhook URL:"]

        set chan [open .env.tmp a]
        puts $chan "${envname}_WEBHOOK=h${url}"
        close $chan
      }
    }
    expect eof
  }
}

# Sources:
# https://www.tcl.tk/man/tcl8.4/TclCmd/puts.html
# https://www.tcl.tk/man/tcl/TclCmd/string.html#M53
# https://linux.die.net/man/1/expect
# https://www.tcl.tk/man/expect5.31/expect.1.html