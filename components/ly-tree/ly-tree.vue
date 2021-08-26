<template>
	<view>
		<template v-if="showLoading">
			<view class="ly-loader ly-flex-center">
				<view class="ly-loader-inner">加载中...</view>
			</view>
		</template>
		
		<template v-else>
			<view v-if="isEmpty || !visible" 
				class="ly-empty">
				{{emptyText}}
			</view>
			<view :key="updateKey"
				class="ly-tree" 
				:class="{'is-empty': isEmpty || !visible}" 
				role="tree" 
				name="LyTreeExpand">
				<ly-tree-node v-for="nodeId in childNodesId" 
					:nodeId="nodeId" 
					:render-after-expand="renderAfterExpand"
					:show-checkbox="showCheckbox" 
					:show-radio="showRadio" 
					:check-only-leaf="checkOnlyLeaf"
					:key="getNodeKey(nodeId)" 
					:indent="indent" 
					:icon-class="iconClass">
				</ly-tree-node>
			</view>
		</template>
	</view>
</template>

<script>
	import Vue from 'vue'
	import TreeStore from './model/tree-store.js';
	import {getNodeKey} from './tool/util.js';
	import LyTreeNode from './ly-tree-node.vue';

	export default {
		name: 'LyTree',
		
		componentName: 'LyTree',
		
		components: {
			LyTreeNode
		},
		
		data() {
			return {
				updateKey: new Date().getTime(), // 数据更新的时候，重新渲染树
				elId: `ly_${Math.ceil(Math.random() * 10e5).toString(36)}`,
				visible: true,
				store: {
					ready: false
				},
				currentNode: null,
				childNodesId: []
			};
		},
		
		provide() {
		    return {
		       tree: this
		    }
		},
		
		props: {
			// 展示数据
			treeData: Array,
			
			// 自主控制loading加载，避免数据还没获取到的空档出现“暂无数据”字样
			ready: {
				type: Boolean,
				default: true
			},
			
			// 内容为空的时候展示的文本
			emptyText: {
				type: String,
				default: '暂无数据'
			},
			
			// 是否在第一次展开某个树节点后才渲染其子节点
			renderAfterExpand: {
				type: Boolean,
				default: true
			},
			
			// 每个树节点用来作为唯一标识的属性，整棵树应该是唯一的
			nodeKey: String,
			
			// 在显示复选框的情况下，是否严格的遵循父子不互相关联的做法，默认为 false
			checkStrictly: Boolean,
			
			// 是否默认展开所有节点
			defaultExpandAll: Boolean,
			
			// 切换全部展开、全部折叠
			toggleExpendAll: Boolean,
			
			// 是否在点击节点的时候展开或者收缩节点， 默认值为 true，如果为 false，则只有点箭头图标的时候才会展开或者收缩节点
			expandOnClickNode: {
				type: Boolean,
				default: true
			},
			
			// 选中的时候展开节点
			expandOnCheckNode: {
				type: Boolean,
				default: true
			},
			
			// 是否在点击节点的时候选中节点，默认值为 false，即只有在点击复选框时才会选中节点
			checkOnClickNode: Boolean,
			checkDescendants: {
				type: Boolean,
				default: false
			},
			
			// 展开子节点的时候是否自动展开父节点
			autoExpandParent: {
				type: Boolean,
				default: true
			},
			
			// 默认勾选的节点的 key 的数组
			defaultCheckedKeys: Array,
			
			// 默认展开的节点的 key 的数组
			defaultExpandedKeys: Array,
			
			// 是否展开当前节点的父节点
			expandCurrentNodeParent: Boolean,
			
			// 当前选中的节点
			currentNodeKey: [String, Number],
			
			// 是否最后一层叶子节点才显示单选/多选框
			checkOnlyLeaf: {
				type: Boolean,
				default: false
			},
			
			// 节点是否可被选择
			showCheckbox: {
				type: Boolean,
				default: false
			},
			
			// 节点单选
			showRadio: {
				type: Boolean,
				default: false
			},
			
			// 配置选项
			props: {
				type: [Object, Function],
				default () {
					return {
						children: 'children', // 指定子树为节点对象的某个属性值
						label: 'label', // 指定节点标签为节点对象的某个属性值
						disabled: 'disabled' //	指定节点选择框是否禁用为节点对象的某个属性值
					};
				}
			},
			
			// 是否懒加载子节点，需与 load 方法结合使用
			lazy: {
				type: Boolean,
				default: false
			},
			
			// 是否高亮当前选中节点，默认值是 false
			highlightCurrent: Boolean,
			
			// 加载子树数据的方法，仅当 lazy 属性为true 时生效
			load: Function,
			
			// 对树节点进行筛选时执行的方法，返回 true 表示这个节点可以显示，返回 false 则表示这个节点会被隐藏
			filterNodeMethod: Function,
			
			// 搜索时是否展示匹配项的所有子节点
			childVisibleForFilterNode: {
				type: Boolean,
				default: false
			},
			
			// 是否每次只打开一个同级树节点展开
			accordion: Boolean,
			
			// 相邻级节点间的水平缩进，单位为像素
			indent: {
				type: Number,
				default: 18
			},
			
			// 自定义树节点的展开图标
			iconClass: String,
			
			// 是否显示节点图标，如果配置为true,需要配置props中对应的图标属性名称
			showNodeIcon: {
				type: Boolean,
				default: false
			},
			
			// 当节点图标显示出错时，显示的默认图标
			defaultNodeIcon: {
				type: String,
				default: 'https://img-cdn-qiniu.dcloud.net.cn/uniapp/doc/github.svg'
			},
			
			// 如果数据量较大，建议不要在node节点中添加parent属性，会造成性能损耗
			isInjectParentInNode: {
				type: Boolean,
				default: false
			}
		},
		
		computed: {
			isEmpty() {
				if (this.store.root) {
					const childNodes = this.store.root.getChildNodes(this.childNodesId);
					
					return !childNodes || childNodes.length === 0 || childNodes.every(({visible}) => !visible);
				}
				
				return true;
			},
			showLoading() {
				return !(this.store.ready && this.ready);
			}
		},
		
		watch: {
			toggleExpendAll(newVal) {
				this.store.toggleExpendAll(newVal);
			},
			defaultCheckedKeys(newVal) {
				this.store.setDefaultCheckedKey(newVal);
			},
			defaultExpandedKeys(newVal) {
				this.store.defaultExpandedKeys = newVal;
				this.store.setDefaultExpandedKeys(newVal);
			},
			checkStrictly(newVal) {
				this.store.checkStrictly = newVal || this.checkOnlyLeaf;
			},
			'store.root.childNodesId'(newVal) {
				this.childNodesId = newVal;
			},
			'store.root.visible'(newVal) {
				this.visible = newVal;
			},
			childNodesId(){
				this.$nextTick(() => {
					this.$emit('ly-tree-render-completed');
				});
			},
			treeData: {
				handler(newVal) {
					this.updateKey = new Date().getTime();
					this.store.setData(newVal);
				},
				deep: true
			}
		},
		
		methods: {
			/*
			 * @description 对树节点进行筛选操作
			 * @method filter
			 * @param {all} value 在 filter-node-method 中作为第一个参数
			 * @param {Object} data 搜索指定节点的节点数据，不传代表搜索所有节点，假如要搜索A节点下面的数据，那么nodeData代表treeData中A节点的数据
			*/
			filter(value, data) {
				if (!this.filterNodeMethod) throw new Error('[Tree] filterNodeMethod is required when filter');
				this.store.filter(value, data);
			},
			
			/*
			 * @description 获取节点的唯一标识符
			 * @method getNodeKey
			 * @param {String, Number} nodeId
			 * @return {String, Number} 匹配到的数据中的某一项数据
			*/
			getNodeKey(nodeId) {
				let node = this.store.root.getChildNodes([nodeId])[0];
				return getNodeKey(this.nodeKey, node.data);
			},
			
		   /*
		    * @description 获取节点路径
		    * @method getNodePath
		    * @param {Object} data 节点数据
		    * @return {Array} 路径数组
		   */
			getNodePath(data) {
				return this.store.getNodePath(data);
			},
			
			/*
			 * @description 若节点可被选择（即 show-checkbox 为 true），则返回目前被选中的节点所组成的数组
			 * @method getCheckedNodes
			 * @param {Boolean} leafOnly 是否只是叶子节点，默认false
			 * @param {Boolean} includeHalfChecked 是否包含半选节点，默认false
			 * @return {Array} 目前被选中的节点所组成的数组
			*/
			getCheckedNodes(leafOnly, includeHalfChecked) {
				return this.store.getCheckedNodes(leafOnly, includeHalfChecked);
			},
			
			/*
			 * @description 若节点可被选择（即 show-checkbox 为 true），则返回目前被选中的节点的 key 所组成的数组
			 * @method getCheckedKeys
			 * @param {Boolean} leafOnly 是否只是叶子节点，默认false,若为 true 则仅返回被选中的叶子节点的 keys
			 * @param {Boolean} includeHalfChecked 是否返回indeterminate为true的节点，默认false
			 * @return {Array} 目前被选中的节点所组成的数组
			*/
			getCheckedKeys(leafOnly, includeHalfChecked) {
				return this.store.getCheckedKeys(leafOnly, includeHalfChecked);
			},
			
			/*
			 * @description 获取当前被选中节点的 data，若没有节点被选中则返回 null
			 * @method getCurrentNode
			 * @return {Object} 当前被选中节点的 data，若没有节点被选中则返回 null
			*/
			getCurrentNode() {
				const currentNode = this.store.getCurrentNode();
				return currentNode ? currentNode.data : null;
			},
			
			/*
			 * @description 获取当前被选中节点的 key，若没有节点被选中则返回 null
			 * @method getCurrentKey
			 * @return {all} 当前被选中节点的 key， 若没有节点被选中则返回 null
			*/
			getCurrentKey() {
				const currentNode = this.getCurrentNode();
				return currentNode ? currentNode[this.nodeKey] : null;
			},
			
			/*
			 * @description 设置全选/取消全选
			 * @method setCheckAll
			 * @param {Boolean} isCheckAll 选中状态,默认为true
			*/
			setCheckAll(isCheckAll = true) {
				if (this.showRadio) throw new Error('You set the "show-radio" property, so you cannot select all nodes');
				
				if (!this.showCheckbox) console.warn('You have not set the property "show-checkbox". Please check your settings');
				
				this.store.setCheckAll(isCheckAll);
			},
			
			/*
			 * @description 设置目前勾选的节点
			 * @method setCheckedNodes
			 * @param {Array} nodes 接收勾选节点数据的数组
			 * @param {Boolean} leafOnly 是否只是叶子节点, 若为 true 则仅设置叶子节点的选中状态，默认值为 false
			*/
			setCheckedNodes(nodes, leafOnly) {
				this.store.setCheckedNodes(nodes, leafOnly);
			},
			
			/*
			 * @description 通过 keys 设置目前勾选的节点
			 * @method setCheckedKeys
			 * @param {Array} keys 勾选节点的 key 的数组 
			 * @param {Boolean} leafOnly 是否只是叶子节点, 若为 true 则仅设置叶子节点的选中状态，默认值为 false
			*/
			setCheckedKeys(keys, leafOnly) {
				if (!this.nodeKey) throw new Error('[Tree] nodeKey is required in setCheckedKeys');
				this.store.setCheckedKeys(keys, leafOnly);
			},
			
			/*
			 * @description 通过 key / data 设置某个节点的勾选状态
			 * @method setChecked
			 * @param {all} data 勾选节点的 key 或者 data 
			 * @param {Boolean} checked 节点是否选中
			 * @param {Boolean} deep 是否设置子节点 ，默认为 false
			*/
			setChecked(data, checked, deep) {
				this.store.setChecked(data, checked, deep);
			},
			
			/*
			 * @description 若节点可被选择（即 show-checkbox 为 true），则返回目前半选中的节点所组成的数组
			 * @method getHalfCheckedNodes
			 * @return {Array} 目前半选中的节点所组成的数组
			*/
			getHalfCheckedNodes() {
				return this.store.getHalfCheckedNodes();
			},
			
			/*
			 * @description 若节点可被选择（即 show-checkbox 为 true），则返回目前半选中的节点的 key 所组成的数组
			 * @method getHalfCheckedKeys
			 * @return {Array} 目前半选中的节点的 key 所组成的数组
			*/
			getHalfCheckedKeys() {
				return this.store.getHalfCheckedKeys();
			},
			
			/*
			 * @description 通过 node 设置某个节点的当前选中状态
			 * @method setCurrentNode
			 * @param {Object} node 待被选节点的 node
			*/
			setCurrentNode(node) {
				if (!this.nodeKey) throw new Error('[Tree] nodeKey is required in setCurrentNode');
				this.store.setUserCurrentNode(node);
			},
			
			/*
			 * @description 通过 key 设置某个节点的当前选中状态
			 * @method setCurrentKey
			 * @param {all} key 待被选节点的 key，若为 null 则取消当前高亮的节点
			*/
			setCurrentKey(key) {
				if (!this.nodeKey) throw new Error('[Tree] nodeKey is required in setCurrentKey');
				this.store.setCurrentNodeKey(key);
			},
			
			/*
			 * @description 根据 data 或者 key 拿到 Tree 组件中的 node
			 * @method getNode
			 * @param {all} data 要获得 node 的 key 或者 data
			*/
			getNode(data) {
				return this.store.getNode(data);
			},
			
			/*
			 * @description 删除 Tree 中的一个节点
			 * @method remove
			 * @param {all} data 要删除的节点的 data 或者 node
			*/
			remove(data) {
				this.store.remove(data);
			},
			
			/*
			 * @description 为 Tree 中的一个节点追加一个子节点
			 * @method append
			 * @param {Object} data 要追加的子节点的 data 
			 * @param {Object} parentNode 子节点的 parent 的 data、key 或者 node
			*/
			append(data, parentNode) {
				this.store.append(data, parentNode);
			},
			
			/*
			 * @description 为 Tree 的一个节点的前面增加一个节点
			 * @method insertBefore
			 * @param {Object} data 要增加的节点的 data 
			 * @param {all} refNode 要增加的节点的后一个节点的 data、key 或者 node
			*/
			insertBefore(data, refNode) {
				this.store.insertBefore(data, refNode);
			},
			
			/*
			 * @description 为 Tree 的一个节点的后面增加一个节点
			 * @method insertAfter
			 * @param {Object} data 要增加的节点的 data 
			 * @param {all} refNode 要增加的节点的前一个节点的 data、key 或者 node
			*/
			insertAfter(data, refNode) {
				this.store.insertAfter(data, refNode);
			},
			
			/*
			 * @description 通过 keys 设置节点子元素
			 * @method updateKeyChildren
			 * @param {String, Number} key 节点 key 
			 * @param {Object} data 节点数据的数组
			*/
			updateKeyChildren(key, data) {
				if (!this.nodeKey) throw new Error('[Tree] nodeKey is required in updateKeyChild');
				this.store.updateChildren(key, data);
			}
		},
		
		created() {
			this.isTree = true;
			
			let props = this.props;
			if (typeof this.props === 'function') props = this.props();
			if (typeof props !== 'object') throw new Error('props must be of object type.');
			
			this.store = new TreeStore({
				key: this.nodeKey,
				data: this.treeData,
				lazy: this.lazy,
				props: props,
				load: this.load,
				showCheckbox: this.showCheckbox,
				showRadio: this.showRadio,
				currentNodeKey: this.currentNodeKey,
				checkStrictly: this.checkStrictly || this.checkOnlyLeaf,
				checkDescendants: this.checkDescendants,
				expandOnCheckNode: this.expandOnCheckNode,
				defaultCheckedKeys: this.defaultCheckedKeys,
				defaultExpandedKeys: this.defaultExpandedKeys,
				expandCurrentNodeParent: this.expandCurrentNodeParent,
				autoExpandParent: this.autoExpandParent,
				defaultExpandAll: this.defaultExpandAll,
				filterNodeMethod: this.filterNodeMethod,
				childVisibleForFilterNode: this.childVisibleForFilterNode,
				showNodeIcon: this.showNodeIcon,
				isInjectParentInNode: this.isInjectParentInNode
			});

			this.childNodesId = this.store.root.childNodesId;
		},
		
		beforeDestroy() {
			if (this.accordion) {
				uni.$off(`${this.elId}-tree-node-expand`)
			}
		}
	};
</script>

<style>
	.ly-tree {
		position: relative;
		cursor: default;
		background: #FFF;
		color: #606266;
		padding: 30rpx;
	}
	
	.ly-tree.is-empty {
		background: transparent;
	}
	
	/* lyEmpty-start */
	.ly-empty {
		width: 100%;
		display: flex;
		justify-content: center;
		margin-top: 100rpx;
	}
	/* lyEmpty-end */
	
	/* lyLoader-start */
	.ly-loader {
		margin-top: 100rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	
	.ly-loader-inner,
	.ly-loader-inner:before,
	.ly-loader-inner:after {
		background: #efefef;
		animation: load 1s infinite ease-in-out;
		width: .5em;
		height: 1em;
	}
	
	.ly-loader-inner:before,
	.ly-loader-inner:after {
		position: absolute;
		top: 0;
		content: '';
	}
	
	.ly-loader-inner:before {
		left: -1em;
	}
	
	.ly-loader-inner {
		text-indent: -9999em;
		position: relative;
		font-size: 22rpx;
		animation-delay: 0.16s;
	}
	
	.ly-loader-inner:after {
		left: 1em;
		animation-delay: 0.32s;
	}
	/* lyLoader-end */
	
	@keyframes load {
		0%,
		80%,
		100% {
			box-shadow: 0 0 #efefef;
			height: 1em;
		}
	
		40% {
			box-shadow: 0 -1.5em #efefef;
			height: 1.5em;
		}
	}
</style>
