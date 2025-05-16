import ipaddress
import subprocess
def connectdb():
    a=input("ENter ip address")
    try:
        ipaddress.ip_address(a)
    except ValueError :
        print('invalid ip !!!')
    return 
    subprocess.run(["ping", a])

if __name__=="__main__":
    connectdb()