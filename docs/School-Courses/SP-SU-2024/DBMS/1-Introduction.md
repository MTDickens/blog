# Lec 1: Introduction

## ToC

- **Database Systems:**
  - Database system concepts
  - Database Applications
  - Purpose of Database Systems

- **Data Modeling:**
  - Data Models
  - Data abstraction
  - Database Design

- **Database Languages**
- **DBMS System Structure:**
  - Storage manager
  - Query processing
  - Transaction manager

- **Database and Application Architectures**
- **Database Users**
- **History of Database Systems**

## Database system concepts

- **数据库系统**：包含关于特定组织的信息
  - *数据*：一组相互关联的数据。例如，一个公司的员工信息数据库。
  - *程序*：用于访问数据的一套程序。比如，一个用于查询员工工资信息的程序。
  - *环境*：一个方便且高效的使用环境。比如，一个可以轻松查询和更新数据的用户界面。

- **数据库**
  - 一组相互关联的数据（关于特定原因）。例如，一家医院的病人病历数据库。
  - **极具价值**。例如，一个银行的客户交易记录数据库。
  - **相对较大** -- 需要良好的组织。例如，一个电商平台的产品信息数据库。
  - **同时被多个用户和应用程序访问**。例如，一个在线社交网络的用户信息数据库。
  - **信息的安全性**，即使系统崩溃或未经授权的访问也能得到保障。例如，一个政府机构的公民个人资料数据库。

- **DBMS（数据库管理系统）**：
  - **一种软件**：一套用于访问数据的程序。例如，一个用于管理学生课程成绩的学校管理系统。
  - 能够管理数据库。
  - 提供了一个既方便又高效的使用环境。例如，一个用于管理图书馆藏书的图书馆管理软件。

## Database Applications

总体来说，DBMS 目前主要用于两个方面：

- 逻辑复杂、性能要求不高的，如用于银行
- 逻辑相对简单、性能要求高，如用于电子商务

### University Database Example

- **Data consists of information about**:

  - Students
  - Instructors
  - Classes

- **Application program examples**:

  - Add new students, instructors, and courses
  - Register students for courses, and generate class rosters
  - Assign grades to students, compute grade point averages (GPA), and generate transcripts

## View of Data

### Data Model

#### 关系模型 (Relational Model):

在关系模型中，数据以表格的形式组织，其中每个表格称为一个关系或表，每行代表一个记录，每列代表一个属性。关系之间通过共同的属性建立连接。

**实例：**

假设我们有一个学校数据库，其中有两个关系：学生（Students）和课程（Courses）。

```
Students Table:
| StudentID | Name     | Age | Major    |
|-----------|----------|-----|----------|
| 001       | Alice    | 20  | Biology  |
| 002       | Bob      | 22  | Physics  |
| 003       | Charlie  | 21  | History  |

Courses Table:
| CourseID | CourseName | Instructor  |
|----------|------------|-------------|
| 101      | Biology    | Dr. Smith   |
| 102      | Physics    | Dr. Johnson |
| 103      | History    | Prof. Lee   |
```

#### OO 模型 (Object-Oriented Model):

在面向对象模型中，数据以对象的形式组织，每个对象包含数据以及操作数据的方法。对象之间通过消息传递进行通信。

**实例：**

考虑一个汽车租赁系统，其中有一个对象是Car，另一个对象是Customer。

```
               +---------------------+
               |       Car           |
               +---------------------+
               | - make: string      |
               | - model: string     |
               | - year: int         |
               | - pricePerDay: int |
               +---------------------+

               +---------------------+
               |      Customer       |
               +---------------------+
               | - name: string      |
               | - age: int          |
               | - email: string     |
               +---------------------+
```

#### OR 模型 (Object-Relational Model):

对象关系模型是关系模型和面向对象模型的结合，允许在关系数据库中存储对象数据，并支持面向对象编程的概念，如继承和多态性。

**实例：**

考虑一个图书馆系统，其中书籍（Books）是对象，但它们也可以根据不同的类型进行分类。

```
               +-------------------------+
               |          Book           |
               +-------------------------+
               | - title: string         |
               | - author: string        |
               | - publicationYear: int  |
               +-------------------------+

               +-------------------------+
               |        TextBook         |
               +-------------------------+
               | - subject: string       |
               | - edition: int          |
               +-------------------------+

               +-------------------------+
               |       Novel             |
               +-------------------------+
               | - genre: string         |
               | - pages: int            |
               +-------------------------+
```

#### ER 模型 (Entity-Relationship Model):

实体-关系模型是一种数据模型，用于描述现实世界中的实体以及它们之间的关系。实体通常表示为矩形，关系表示为菱形，而属性表示为椭圆。

**实例：**

考虑一个在线商店，其中有顾客（Customers）、产品（Products）和订单（Orders）之间的关系。

```
           +---------------+      has        +--------------+
           |   Customer    | -------------- |    Order     |
           +---------------+                +--------------+
           | - ID: int     |      has        | - OrderID    |
           | - Name: string| -------------- | - CustomerID |
           | - Email: string                | - TotalPrice |
           +---------------+                +--------------+
                                contains
                                     |
                                     v
                            +-------------------+
                            |     Product       |
                            +-------------------+
                            | - ProductID: int  |
                            | - Name: string    |
                            | - Price: float    |
                            +-------------------+
```

趋势：

- 关系模型
  - 应用最广的模型
  - 我们这一节课要实现的模型
- OO 模型
- OR 模型
  - 两个对象模型可能是今后的方向
- ER 模型
  - 非常重要的模型

### Data Abstraction

我们采用 schema and instance model

- Logical Schema
  - The logical structure of the database
  - Analogous to the **type** of a variable
- Physical Schema
  - The overall physical structure of the database
- Instance
  - The actual content of the DB at a particular point of time
  - Analogous to the **value** of a variable

## Programming Language

### DDL (Data Definition Language)

- DDL compiler 会生成一个 data dictionary
- Data dictionary contains metadata
  - database schema
    - 列名+数据类型
  - integrity constraints
    - 主键：uniqueness
    - 外键：referential integrity
      - i.e. 保证***课程安排***的**课程号**、**教师号**永远会出现在***课程***的**课程号**和***教师***的**教师号**当中
        - 因此，如果不在其中，那么插入错误
        - 如果***课程安排***仍有 entry 的**课程号**在***课程***的***课程号***里，那么就不能删除***课程***的**课程号**对应的 entry
    - 其他约束：如非空等等
  - authorization
    - 这里没有给出，不过不难理解

### DML (Data Manipulation Language)

- Language for accessing and manipulating the data organized by the appropriate data model
  - DML also known as query language
- SQL is the most widely used query language

### 数据库设计示例：大学课程管理系统

**数据字典**

代码段

```
| 表名 | 列名 | 数据类型 | 主键 | 外键 | 约束 |
|---|---|---|---|---|---|
| 课程 | 课程号 | 字符(10) | 是 | | 非空 |
| 课程 | 课程名 | 字符(50) | | | 非空 |
| 课程 | 学分 | 整数 | | | 非空 |
| 教师 | 教师号 | 字符(10) | 是 | | 非空 |
| 教师 | 教师名 | 字符(50) | | | 非空 |
| 教师 | 所属系 | 字符(10) | | | 非空 |
| 课程安排 | 课程号 | 字符(10) | | 课程.课程号 | 非空 |
| 课程安排 | 教师号 | 字符(10) | | 教师.教师号 | 非空 |
| 课程安排 | 学期 | 字符(10) | | | 非空 |
```

**SQL 代码**

SQL

```sql
-- 创建课程表
CREATE TABLE 课程 (
  课程号 CHAR(10) PRIMARY KEY NOT NULL,
  课程名 CHAR(50) NOT NULL,
  学分 INT NOT NULL
);

-- 创建教师表
CREATE TABLE 教师 (
  教师号 CHAR(10) PRIMARY KEY NOT NULL,
  教师名 CHAR(50) NOT NULL,
  所属系 CHAR(10) NOT NULL
);

-- 创建课程安排表
CREATE TABLE 课程安排 (
  课程号 CHAR(10) NOT NULL,
  教师号 CHAR(10) NOT NULL,
  学期 CHAR(10) NOT NULL,
  FOREIGN KEY (课程号) REFERENCES 课程(课程号),
  FOREIGN KEY (教师号) REFERENCES 教师(教师号)
);

-- 插入数据
INSERT INTO 课程 VALUES ('CS101', '计算机科学概论', 3);
INSERT INTO 课程 VALUES ('MA201', '高等数学', 4);
INSERT INTO 教师 VALUES ('T001', '张三', '计算机系');
INSERT INTO 教师 VALUES ('T002', '李四', '数学系');
INSERT INTO 课程安排 VALUES ('CS101', 'T001', '2023-2024秋季');
INSERT INTO 课程安排 VALUES ('MA201', 'T002', '2023-2024秋季');

-- 查询所有课程
SELECT * FROM 课程;

-- 查询所有教师
SELECT * FROM 教师;

-- 查询所有课程安排
SELECT * FROM 课程安排;

-- 查询由张三教授的课程
SELECT 课程.*
FROM 课程安排
INNER JOIN 教师 ON 课程安排.教师号 = 教师.教师号
WHERE 教师.教师名 = '张三';
```

**完整性约束示例**

- 主键约束：确保每个课程号和教师号都是唯一的。
- 外键约束：确保课程安排表中的课程号和教师号都存在于相应的表中。
- 非空约束：确保课程名、教师名、所属系、学分和学期等字段不能为空。

## DBMS System Structure

<img src="https://cdn.jsdelivr.net/gh/mtdickens/mtd-images/img/202402291317919.png" alt="image-20240229131704059" style="zoom:67%;" />

### Storage manager

The storage manager is responsible for

- Interaction with the OS file manager
- Efficient storing, retrieving and updating of data

### Query processer

分为 DDL

- Interpreter: Interpret DDL statements to relational-algebra expression
- Compiler: Translate the expressions to **evaluation plans**
- Evaluation Engine: Execute the low-level evaluation plan (, and return the query output)

<img src="https://cdn.jsdelivr.net/gh/mtdickens/mtd-images/img/202402291331178.png" alt="image-20240229133136418" style="zoom:50%;" />

### Transaction manager

用于保证

- 原子性
- 一致性**（注意不是 DDL 的一致性）**
  - 事务执行前后，数据库的状态都必须满足一定的约束条件，保证数据的逻辑完整性
    - e.g. A 向 B 转 100 元，那么，A 如果转出成功，那么 B 必须转入成功
- 隔离性
  - 不干扰其他 txs 的执行
- 持久性（Durability）
  - 一旦事务提交，其对数据库所做的更改将永久保存，即使系统发生故障也不会丢失

## Database Users