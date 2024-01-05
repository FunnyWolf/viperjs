### web

- 统一参数控制调用quake等最大结果数
- 支持nmap的扫描导入
- 支持股权关联
- 指纹集成
- 集成xray
- 备案信息查询
- 主动子域名收集(证书/备案)
- 将Setting页面优化,删除不相关功能
- 邮箱信息收集 页面/收集工具/展示/数据库设计
- nuclei集成,为数据库表结构和前端交互做准备
- 展示一个project里面数据的所有ip地址,子网,子域名,主域名
- service搜索功能有提示,展示系统中所有已经存在的service,支持组件搜索
- 后期实现自动化模块,通过API来组合各部分代码
- https://github.com/projectdiscovery/nuclei/blob/dev/examples/advanced/advanced.go nuclei改造
- 自动化通过运行原子模块来进行操作
- Django subquery和outerref优化
- 通过模块配置项来确定自动化方式
- 首先实现quake的全流程自动化
- 使用代码来补充zoomeye/fofa等相对于quake缺失的功能

### post

- 集成项目https://github.com/qwqdanchun/Pillager

### Done

- ~~测试WAF识别,CDN识别工具,确认数据库字段~~
- ~~LHOST信息新增check功能,是不是外网IP(或者是不是IP)~~
- ~~针对某个端口记录可以添加备注功能,方便进行跟踪,也添加tag功能~~
- ~~https://hunter.qianxin.com/home/helpCenter?r=5-1-3 hunter接口接入~~
