- 每个模块的参数可以完备的运行,不依赖input_list
- 添加直接执行quake搜索语句的模块
- 设计一个实时输出运行信息的新的Notice模块
- 测试WAF识别,CDN识别工具,确认数据库字段
- LHOST信息新增check功能,是不是外网IP(或者是不是IP)
- service搜索功能有提示,展示系统中所有已经存在的service,支持组件搜索
- 集成项目https://github.com/qwqdanchun/Pillager
- 针对某个端口记录可以添加备注功能,方便进行跟踪,也添加tag功能
- 后期实现自动化模块,通过API来组合各部分代码
- 将任务列表移交到top button和modal
- 添加一个modal,全量展示说有的ipdomain
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