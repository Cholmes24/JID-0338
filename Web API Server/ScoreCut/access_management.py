import socket
import secrets
from datetime import datetime


class TimedSet(dict):
    def __init__(self, time_limit=10):
        super().__init__()
        self.time_limit = time_limit

    def add(self, item):
        self[item] = datetime.now()
        self.clean()

    def __contains__(self, item):
        if item in self.keys():
            seconds_elapsed = (datetime.now() - self[item]).total_seconds()
            if seconds_elapsed < self.time_limit:
                return True
            self.pop(item)
        return False

    def clean(self):
        now = datetime.now()
        to_remove = []
        for entry in self:
            seconds_elapsed = (now - self[entry]).total_seconds()
            if seconds_elapsed >= self.time_limit:
                to_remove.append(entry)

        for elem in to_remove:
            if elem in self:
                self.pop(elem)


class AccessManagement:
    def __init__(self):
        self.active_tokens = TimedSet(24 * 60 * 60)
        self.active_access_codes = TimedSet(5 * 60)

    def create_new_access_code(self):
        length_before = len(self.active_access_codes)
        if length_before > 36 * 10:
            return 'Too many access codes active.'

        new_access_code = generate_access_code()
        attempts_left = 5
        while new_access_code in self.active_access_codes and attempts_left > 0:
            new_access_code = generate_access_code()        # checking for duplicates
            attempts_left -= 1
        if new_access_code in self.active_access_codes and attempts_left == 0:
            return 'Unable to generate access code. Please try again later.'
        self.active_access_codes.add(new_access_code)
        return f'Access Code: {new_access_code}'

    def create_new_token(self):
        new_token = secrets.token_urlsafe(32)
        self.active_tokens.add(new_token)
        return new_token


def get_ip():
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    try:
        # doesn't even have to be reachable
        s.connect(('10.255.255.255', 1))
        IP = s.getsockname()[0]
    except Exception:
        IP = '127.0.0.1'
    finally:
        s.close()
    return IP


def decimal_to_8bit(n):
    return bin(int(n)).replace('0b', '').zfill(8)


def decimal_to_alphanum(n):
    return chr(n + 48) if (0 <= n <= 9) else chr(n + 55)


def generate_access_code(length=7):
    if length < 5:
        raise
    IP = get_ip()
    base = 36
    extra_pad = length - 5
    octets = IP.split('.')[1:]
    bin_tail = ''.join(map(decimal_to_8bit, octets))
    div = int(bin_tail, 2)
    code = ''
    while len(code) < 5:
        div, mod = divmod(div, base)
        code = decimal_to_alphanum(mod) + code
    chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    for i in range(extra_pad):
        code += chars[secrets.randbelow(len(chars))]
    return code
