---
id: phoenix-dgc-api
title: 接口说明
---

DGC 提供以下三个注解头：

- @Model
- @Compute
- @Observable

## @Model

如果一个类需要使用 DGC 功能，则需要在类头上添加 `@Model` 注解。只有加了 @Model 注解的类，DGC 在实例化对象时才会动态代理。

## @Observable

`@Observable` 作用于 `@Model` 标识的类中的属性上。

如果一个属性被 `@Observable` 注解标识，需要为该属性提供相应的 get/set 方法。

同时 DGC 会对该属性进行监听：

 - 当调用该属性的 get 方法时，会根据调用关系构建依赖关系图。
 - 当调用该属性的 set 方法时，会根据 DGC 中维护的依赖关系图，将所有涉及到的方法的缓存置为失效（删除）。

```java
@Observable(implClass = CopyOnWriteArrayList.class)
private List<String> list;
```

## @Compute

`@Compute` 作用于 `@Model` 标识的类中的方法上。

被 `@Compute` 标识的方法，在每次计算之后会对结果进行缓存。如果在下次访问该方法之前，方法中计算逻辑所涉及到的属性值没有发生变化，则下次访问该方法时会直接返回缓存中的结果，不会再次计算一遍。

**注意：** `@Compute` 注解所标识的方法中只能存在 get 逻辑，不允许出现 set 逻辑。

## DgcObjectManager

DgcObjectManger是 DGC 的核心入口类，用户在使用 DGC 时应首先实例化DgcObjectManager。

```java
DgcObjectManager dgcObjectManager = new DgcObjectManager()
```
一个 DgcObjectManager 对象即可管理 DGC 对象依赖图，当然如果为了追求并发，也可以创建多个 DgcObjectManager（比如 Phoenix 集成 DGC 时，每个聚合根对象拥有一个 DgcObjectManger 对象）。

有了 DgcObjectManager 之后对象之后，可以使用 DgcObjectManager 创建被 `@Model` 注解标识的类的对象，这样该对象的操作就会被 DGC 所代理。

```java
public <T> T getDgcObject(Class<T> targetCls);
public <T> T getDgcObject(Class<T> targetCls, Object... arguments)
```

DgcManager 有一个全局的功能开关，决定是否启用 DGC 功能，默认为 true（开启）。结合 Phoenix 来用时，可以通过在 phoenix-server 的配置中添加如下配置进行启用/停用：

```yaml
quantex.phoenix.server.dgc-enable: true
```
如果是单独使用 DGC 模块的功能，可以通过如下方式选择开启/关闭 DGC 功能。

```java
DgcObjectManager dgcObjectManager = new DgcObjectManager()
dgcObjectManager.setEnable(true/false);
```

## 扩展类使用

针对自定义的类属性，我们可以通过提供相应的 get/set 方法来对属性进行访问和更新，并且通过添加 `@Compute` 注解来对相关方法的值进行缓存。

但是如果使用的类是第三方类库提供的，这个时候我们是没有办法对这些类进行修改的（无法添加 `@Model`、`@Observable`、`@Compute` 等注解）。

例如 List、Set、Map 类型的集合类，对这些集合的更新，就不能简单的通过 set 方法来进行了，集合的很多方法都有可能导致集合数据更新（例如 List 的 add、remove 等方法都会导致集合数据进行更新）。除了这些集合类之外，我们依赖的其他第三方类库提供的类也存在同样的问题。

DGC 针对这种情况提供了一种扩展方式，来使得第三方类库的类也可以使用 DGC 能力。

DGC 提供了 `ExtendClassDefine` 接口，针对第三方类库的类，需要手动添加一个该接口的实现类。

```java
public interface ExtendClassDefine<EXCLASS> {

    /** 判断是否是该扩展(类/接口)的(子类/实现类),或者自己. */
    boolean isSubClassOrSelf(Object obj);

    /** 判断是否是这个扩展类的写方法 */
    boolean isWriteOps(Method method);

     /** 如果扩展类容纳了dgc中的对象使用,比如Map,List,那么需要提供获取所有对象的方法 */
    Set<Object> getCollections(EXCLASS extendObject);
}
```

`ExtendClassDefine` 接口对 `set 方法` 进行了抽象，统一用写方法来表示。一个第三方类中的方法，只要会导致数据的更新（增删改），都属于写方法。

DGC 对所有的扩展类提供了一个统一的抽象类，使用时需要继承这个抽象类，从而实现具体的扩展类实现类。并注册到 DGC 中。之后即可正常使用。

```java
public abstract class AbstractExtendClassDefine<EXCLASS> implements ExtendClassDefine<EXCLASS> {

    /** 写方法集合 */
    protected Set<String> writeName = new HashSet<>();

    @Override
    public abstract boolean isSubClassOrSelf(Object obj);

    @Override
    public boolean isWriteOps(Method method) {
        return writeName.contains(method.getName());
    }

    @Override
    public abstract Set<Object> getCollections(EXCLASS extendObject);
}
```
