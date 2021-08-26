<template>
	<view ref="node"
		name="LyTreeNode" 
		v-show="node.visible" 
		class="ly-tree-node"
		:class="{ 
			'is-expanded': expanded, 
			'is-hidden': !node.visible, 
			'is-checked': !node.disabled && node.checked 
		}"
		role="treeitem" 
		@tap.stop="handleClick" >
		<view class="ly-tree-node__content" 
			:class="{
				'is-current': node.isCurrent && highlightCurrent
			}" 
			:style="{ 
				'padding-left': (node.level - 1) * indent + 'px' 
			}">
			<text 
				@tap.stop="handleExpandIconClick" 
				:class="[
					{ 
						'is-leaf': node.isLeaf, 
						expanded: !node.isLeaf && node.expanded 
					}, 
					'ly-tree-node__expand-icon', 
					iconClass ? iconClass : 'ly-iconfont ly-icon-caret-right'
				]">
			</text>
			
			<ly-checkbox v-if="checkboxVisible || radioVisible"
				:type="checkboxVisible ? 'checkbox' : 'radio'" 
				:checked="node.checked" 
				:indeterminate="node.indeterminate" 
				:disabled="!!node.disabled"
				@check="handleCheckChange(!node.checked)"/>
			
			<text v-if="node.loading" 
				class="ly-tree-node__loading-icon ly-iconfont ly-icon-loading">
			</text>
			
			<template v-if="node.icon && node.icon.length > 0">
				<image 
					v-if="node.icon.indexOf('/') !== -1" 
					class="ly-tree-node__icon" 
					mode="widthFix"
					:src="node.icon" 
					@error="handleImageError"
					>
				</image>
				<text v-else 
					class="ly-tree-node__icon" 
					:class="node.icon">
				</text>
			</template>
			
			<text class="ly-tree-node__label">{{node.label}}</text>
		</view>
		
		<view v-if="!renderAfterExpand || childNodeRendered" 
			v-show="expanded" 
			class="ly-tree-node__children" 
			role="group">
			<ly-tree-node v-for="cNodeId in node.childNodesId" 
				:nodeId="cNodeId" 
				:render-after-expand="renderAfterExpand" 
				:show-checkbox="showCheckbox"
				:show-radio="showRadio" 
				:check-only-leaf="checkOnlyLeaf"
				:key="getNodeKey(cNodeId)" 
				:indent="indent" 
				:icon-class="iconClass">
			</ly-tree-node>
		</view>
	</view>
</template>

<script>
	import {getNodeKey} from './tool/util.js';
	import lyCheckbox from './components/ly-checkbox.vue';

	export default {
		name: 'LyTreeNode',
		
		componentName: 'LyTreeNode',
		
		components: {
			lyCheckbox
		},
		
		props: {
			nodeId: [Number, String],
			renderAfterExpand: {
				type: Boolean,
				default: true
			},
			checkOnlyLeaf: {
				type: Boolean,
				default: false
			},
			showCheckbox: {
				type: Boolean,
				default: false
			},
			showRadio: {
				type: Boolean,
				default: false
			},
			indent: Number,
			iconClass: String
		},
		
		data() {
			return {
				node: {
					indeterminate: false,
					checked: false,
					expanded: false
				},
				expanded: false,
				childNodeRendered: false,
				oldChecked: null,
				oldIndeterminate: null,
				highlightCurrent: false
			};
		},
		
		inject: ['tree'],
		
		computed: {
			checkboxVisible() {
				if (this.checkOnlyLeaf) {
					return this.showCheckbox && this.node.isLeaf;
				}
				
				return this.showCheckbox;
			},
			radioVisible() {
				if (this.checkOnlyLeaf) {
					return this.showRadio && this.node.isLeaf;
				}
				
				return this.showRadio;
			}
		},
		
		watch: {
			'node.indeterminate'(val) {
				this.handleSelectChange(this.node.checked, val);
			},
			'node.checked'(val) {
				this.handleSelectChange(val, this.node.indeterminate);
			},
			'node.expanded'(val) {
				this.$nextTick(() => this.expanded = val);
				if (val) {
					this.childNodeRendered = true;
				}
			}
		},
		
		methods: {
			getNodeKey(nodeId) {
				let node = this.tree.store.root.getChildNodes([nodeId])[0];
				return getNodeKey(this.tree.nodeKey, node.data);
			},
			
			handleSelectChange(checked, indeterminate) {
				if (this.oldChecked !== checked && this.oldIndeterminate !== indeterminate) {
					
					if (this.checkOnlyLeaf && !this.node.isLeaf) return;
					
					if (this.checkboxVisible) {
						const allNodes = this.tree.store._getAllNodes();
						this.tree.$emit('check-change', {
							checked,
							indeterminate,
							node: this.node,
							data: this.node.data,
							checkedall: allNodes.every(item => item.checked)
						});
					} else {
						this.tree.$emit('radio-change', {
							checked,
							node: this.node,
							data: this.node.data,
							checkedall: false
						});
					}
				}
				
				if (!this.expanded && this.tree.expandOnCheckNode && checked) {
					this.handleExpandIconClick();
				}
				
				this.oldChecked = checked;
				this.indeterminate = indeterminate;
			},
			
			handleClick() {
				this.tree.store.setCurrentNode(this.node);
				this.tree.$emit('current-change', {
					node: this.node,
					data: this.tree.store.currentNode ? this.tree.store.currentNode.data : null,
					currentNode: this.tree.store.currentNode
				});
				this.tree.currentNode = this.node;
				
				if (this.tree.expandOnClickNode) {
					this.handleExpandIconClick();
				}
				
				if (this.tree.checkOnClickNode && !this.node.disabled) {
					(this.checkboxVisible || this.radioVisible) && this.handleCheckChange(!this.node.checked);
				}
				
				this.tree.$emit('node-click', this.node);
			},
			
			handleExpandIconClick() {
				if (this.node.isLeaf) return;
				
				if (this.expanded) {
					this.tree.$emit('node-collapse', this.node);
					this.node.collapse();
				} else {
					this.node.expand();
					this.tree.$emit('node-expand', this.node);
					
					if (this.tree.accordion) {
						uni.$emit(`${this.tree.elId}-tree-node-expand`, this.node);
					}
				}
			},
			
			handleCheckChange(checked) {
				if (this.node.disabled) return;
				
				if (this.checkboxVisible) {
					this.node.setChecked(checked, !(this.tree.checkStrictly || this.checkOnlyLeaf));
				} else {
					this.node.setRadioChecked(checked);
				}
				
				this.$nextTick(() => {
					this.tree.$emit('check', {
						node: this.node,
						data: this.node.data,
						checkedNodes: this.tree.store.getCheckedNodes(),
						checkedKeys: this.tree.store.getCheckedKeys(),
						halfCheckedNodes: this.tree.store.getHalfCheckedNodes(),
						halfCheckedKeys: this.tree.store.getHalfCheckedKeys()
					});
				});
			},
			
			handleImageError() {
				this.node.icon = this.tree.defaultNodeIcon;
			}
		},
		
		created() {
			if (!this.tree) {
				throw new Error('Can not find node\'s tree.');
			}
			
			this.node = this.tree.store.nodesMap[this.nodeId];
			this.highlightCurrent = this.tree.highlightCurrent;
			
			if (this.node.expanded) {
				this.expanded = true;
				this.childNodeRendered = true;
			}

			const props = this.tree.props || {};
			const childrenKey = props['children'] || 'children';
			this.$watch(`node.data.${childrenKey}`, () => {
				this.node.updateChildren();
			});

			if (this.tree.accordion) {
				uni.$on(`${this.tree.elId}-tree-node-expand`, node => {
					if (this.node.id !== node.id && this.node.level === node.level) {
						this.node.collapse();
					}
				});
			}
		},
		
		beforeDestroy() {
			this.$parent = null;
		}
	};
</script>

<style>
	.ly-tree-node {
		white-space: nowrap;
		outline: 0
	}
	
	.ly-tree-node__content {
		display: flex;
		align-items: center;
		height: 70rpx;
	}
	
	.ly-tree-node__content.is-current {
		background-color: #F5F7FA;
	}
	
	.ly-tree-node__content>.ly-tree-node__expand-icon {
		padding: 12rpx;
	}
	
	.ly-tree-node__checkbox {
		display: flex;
		margin-right: 16rpx;
		width: 40rpx;
		height: 40rpx;
	}
	
	.ly-tree-node__checkbox>image {
		width: 40rpx;
		height: 40rpx;
	}
	
	.ly-tree-node__expand-icon {
		color: #C0C4CC;
		font-size: 28rpx;
		-webkit-transform: rotate(0);
		transform: rotate(0);
		-webkit-transition: -webkit-transform .3s ease-in-out;
		transition: -webkit-transform .3s ease-in-out;
		transition: transform .3s ease-in-out;
		transition: transform .3s ease-in-out, -webkit-transform .3s ease-in-out
	}
	
	.ly-tree-node__expand-icon.expanded {
		-webkit-transform: rotate(90deg);
		transform: rotate(90deg)
	}
	
	.ly-tree-node__expand-icon.is-leaf {
		color: transparent;
	}
	
	.ly-tree-node__icon {
		width: 34rpx;
		height: 34rpx;
		overflow: hidden;
		margin-right: 16rpx;
	}
	
	.ly-tree-node__label {
		font-size: 28rpx
	}
	
	.ly-tree-node__loading-icon {
		margin-right: 16rpx;
		font-size: 28rpx;
		color: #C0C4CC;
		-webkit-animation: rotating 2s linear infinite;
		animation: rotating 2s linear infinite
	}
	
	.ly-tree-node>.ly-tree-node__children {
		overflow: hidden;
		background-color: transparent
	}
	
	.ly-tree-node>.ly-tree-node__children.collapse-transition {
		transition: height .3s ease-in-out;
	}
	
	.ly-tree-node.is-expanded>.ly-tree-node__children {
		display: block
	}
	
	.ly-tree-node_collapse {
		overflow: hidden;
		padding-top: 0;
		padding-bottom: 0;
	}
	/* lyTree-end */
	
	/* iconfont-start */
	@font-face {
		font-family: "ly-iconfont";
		src: url('data:application/x-font-woff2;charset=utf-8;base64,d09GMgABAAAAAAPsAAsAAAAACKwAAAOeAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHEIGVgCDBgqFDIQPATYCJAMMCwgABCAFhG0HQBtfB8gekiSCdAwUAKgCFMA5Hj7H0PeTlABUr57PVyGqugqzSWJnNwWoWJjx/9rUr4TPL1ZSQpU2mycqwoRwIN3p+MkqMqyEW+OtMBLPSUBb8v//XtWMKTavxYIUsT/Wy1qbQzkBDOYEKGB7dVpPyVqgCnJNwvMvhZl10nMCtQbFoPVhY8ZDncJfF4grbqpQ13AqE52hWqgcOFrEQ6hWnW5VfMCD7Pfjn4WoI6nI/K0bl0MNGPBz0qcflVqYnvCA4vNDPUXGPFCIw8HgtsqiOK9SrW2smm6sVITElWlpISMdVBn8wyMJopLfXg+myZ48KCrSkvj9g37U1ItbXYke4APwXxK3N4TuehyBfmM0I3zbNdt7uk3VnjPtzX0rnIl7z7bZvb/thHohsu9QuykKo+Cws4nL7LsPmI3n2qN9B9upZEIKd4hu0NCKi0rt7fNtdl+I1N25hOJMDQK6odS123tROR7Pg8toEhDaF+kR0TYjxW6M58F5+ZNQOxmZHtE2g+IYjxjlNy/yIRQpCmrgq5R4/3jx8PvT8Ha8d3/xiLnt4EGyaDnznzRv8vpyZ+9TFHf/ntX9e59A+b6+fPHd5+dy0wYHVvHOroWbnWe879O9DnL53bN/gUHuwm28b/n8i/V3ry4E3IoXNqS6Rvs0LhJxeNVjoUkM3LKosU+0a6rh45FVvLt+2oz7Zd53b4QOy7/9snDXHbqVu+A+f8r7PnM2H8kXrWm5c8/vLu7LqRee7HW637mz3kHc5U/RCXf25d7G8tkdgEfwIpzpkknGpaMw3ww55q9Mn9OQNyua/wB/49OOWydn4eL/6roCfjx6FMmcxfJStYRKfd3UwoHiML4rF4uMSK+SvYTuNxMHrpl8yd3Q6v32cAeo/KFaowBJlQHIqo3zi3geKtRZhErVlqDWnOGn67QRKkWpwaw1AkKza5A0egFZszf8In4HFTp9h0rNUQm1NqP1lXUmgyuDBVUlNYi2gHA98FnokUreOZaac1xV1JlMMZGKEs+QdCLVrgynPhUcO0pzzYyUjDAReGSYeBl13YCEIrCpLhOWlGE+mWRD35TQAw8UawRKJVEGQrMAwekCPpaMlpTOz49FmeZwqcREX1t3Ikoo4dMTaQmpBfzhRn9R30uZXTKXKUOSmLSKEQIeYhjqKZcrcIzhMLLRrJMSrA35UF4yGMaWGhPHm733dwJq+Z/NkSJHUXemCirjgpuWrHMD1eC+mQUAAAA=') format('woff2');
	}
	
	.ly-iconfont {
		font-family: "ly-iconfont" !important;
		font-size: 30rpx;
		font-style: normal;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
	}
	
	.ly-icon-caret-right:before {
		content: "\e8ee";
	}
	
	.ly-icon-loading:before {
		content: "\e657";
	}
	/* iconfont-end */
	
	/* animate-start */
	@keyframes rotating {
		0% {
			-webkit-transform: rotateZ(0);
			transform: rotateZ(0)
		}
	
		100% {
			-webkit-transform: rotateZ(360deg);
			transform: rotateZ(360deg)
		}
	}
	/* animate-end */
</style>