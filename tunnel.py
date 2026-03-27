#!/usr/bin/env python3
"""
简单的HTTP隧道脚本
将本地服务暴露到公网
"""

import http.server
import socketserver
import threading
import time
import sys
import os
from urllib.request import urlopen

class ProxyHandler(http.server.BaseHTTPRequestHandler):
    def do_GET(self):
        try:
            # 转发到本地服务
            target_url = f"http://localhost:3000{self.path}"
            response = urlopen(target_url, timeout=10)
            
            self.send_response(response.getcode())
            for header, value in response.headers.items():
                self.send_header(header, value)
            self.end_headers()
            
            self.wfile.write(response.read())
            
        except Exception as e:
            self.send_error(500, f"Proxy error: {str(e)}")
    
    def do_POST(self):
        try:
            content_length = int(self.headers.get('Content-Length', 0))
            post_data = self.rfile.read(content_length)
            
            import urllib.request
            req = urllib.request.Request(
                f"http://localhost:3000{self.path}",
                data=post_data,
                headers={k: v for k, v in self.headers.items() if k.lower() != 'host'},
                method='POST'
            )
            
            response = urllib.request.urlopen(req, timeout=30)
            
            self.send_response(response.getcode())
            for header, value in response.headers.items():
                self.send_header(header, value)
            self.end_headers()
            
            self.wfile.write(response.read())
            
        except Exception as e:
            self.send_error(500, f"Proxy error: {str(e)}")
    
    def log_message(self, format, *args):
        # 减少日志输出
        pass

def start_tunnel(port=8080):
    """启动HTTP隧道"""
    print(f"🚀 启动HTTP隧道服务器在端口 {port}")
    print(f"📡 本地服务: http://localhost:3000")
    print(f"🌐 隧道地址: http://<服务器IP>:{port}")
    
    try:
        # 获取公网IP
        import socket
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))
        local_ip = s.getsockname()[0]
        s.close()
        
        print(f"📱 本地网络访问: http://{local_ip}:{port}")
    except:
        pass
    
    with socketserver.TCPServer(("0.0.0.0", port), ProxyHandler) as httpd:
        print(f"✅ 隧道服务器已启动")
        print(f"📊 等待连接...")
        print(f"🛑 按 Ctrl+C 停止")
        
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n🛑 停止隧道服务器")
            httpd.shutdown()

def check_local_service():
    """检查本地服务是否运行"""
    try:
        response = urlopen("http://localhost:3000", timeout=5)
        if response.getcode() == 200:
            print("✅ 本地服务运行正常")
            return True
    except:
        pass
    
    print("❌ 本地服务未运行")
    print("请先运行: npm run dev 或 serve -s .next -l 3000")
    return False

if __name__ == "__main__":
    import argparse
    
    parser = argparse.ArgumentParser(description="HTTP隧道服务器")
    parser.add_argument("--port", type=int, default=8080, help="隧道端口")
    parser.add_argument("--check", action="store_true", help="只检查服务状态")
    
    args = parser.parse_args()
    
    if args.check:
        check_local_service()
        sys.exit(0)
    
    if not check_local_service():
        print("❌ 无法启动隧道：本地服务未运行")
        sys.exit(1)
    
    start_tunnel(args.port)