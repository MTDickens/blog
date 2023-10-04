# 1 Q & A

[Q1](https://github.com/pypa/pip/issues/10800): Can't set pip source on Windows

A1: I can reproduce but if I add the --user flag it works fine, e.g.

```bash
python3 -m pip config set global.index-url https://pypi.tuna.tsinghua.edu.cn/simple --user
```

This makes sense, the "pip.ini" in "Program Files" is for all users and would need admin privileges to edit, you should be writing you the user level pip configuration.

Also this isn't really a pip issue I don't think, this is a Windows permissions / Python Windows Store issue.