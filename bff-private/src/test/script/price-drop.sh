vm="ben.dev-bixia.ams1.cloud"

function btcurl () {

    # echo "${vm}"
    
    curl "http://${vm}$@" \
        -H "X-BOLT-APPS-ID: RUI" \
        -H "X-BOLT-SITE-LOCALE: en_ZA" \
        -H "X-BOLT-TRACE-ID: ck3sjoh4f0007l1fv19nnboe7" \
        -H "X-BOLT-IP-ADDRESS: 10.236.91.12" \
        -H "X-BOLT-MACHINE-ID: a2fea5c3-02a7-4911-83cb-3a3543acb7c2-16cb7f84cfd" \
        -H "Content-Type: application/json" \
        -H "X-BOLT-USER-AGENT: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36" \
        -s
}


ACCESS_TOKEN=$(btcurl "/boltapi/v1/users/actions/login-with-bolt" -X POST -d "{\"email\":\"bixia@ebay.com\",\"password\":\"vmiscool\"}" | jq .accessToken | xargs echo)

curl "http://localhost:3266/bff/price-drop" \
        -H "BFF-SITE-LOCALE: en_ZA" \
        -H "BFF-TRACE-ID: ck3sjoh4f0007l1fv19nnboe7" \
        -H "BFF-IP-ADDRESS: 10.236.91.12" \
        -H "BFF-MACHINE-ID: a2fea5c3-02a7-4911-83cb-3a3543acb7c2-16cb7f84cfd" \
        -H "BFF-TOKEN: ${ACCESS_TOKEN}"
