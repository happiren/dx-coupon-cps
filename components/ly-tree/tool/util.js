export const NODE_KEY = '$treeNodeId';

export const markNodeData = function(node, data) {
	if (!data || data[NODE_KEY]) return;
	Object.defineProperty(data, NODE_KEY, {
		value: node.id,
		enumerable: false,
		configurable: false,
		writable: false
	});
};

export const getNodeKey = function(key, data) {
	if (!data) return null;
	if (!key) return data[NODE_KEY];
	return data[key];
};

export const objectAssign = function(target) {
	for (let i = 1, j = arguments.length; i < j; i++) {
		let source = arguments[i] || {};
		for (let prop in source) {
			if (source.hasOwnProperty(prop)) {
				let value = source[prop];
				if (value !== undefined) {
					target[prop] = value;
				}
			}
		}
	}

	return target;
};

// TODO: use native Array.find, Array.findIndex when IE support is dropped
export const arrayFindIndex = function(arr, pred) {
	for (let i = 0; i !== arr.length; ++i) {
		if (pred(arr[i])) {
			return i;
		}
	}
	return -1;
};

export const getChildState = function(node) {
	let all = true;
	let none = true;
	let allWithoutDisable = true;
	for (let i = 0, j = node.length; i < j; i++) {
		const n = node[i];
		if (n.checked !== true || n.indeterminate) {
			all = false;
			if (!n.disabled) {
				allWithoutDisable = false;
			}
		}
		if (n.checked !== false || n.indeterminate) {
			none = false;
		}
	}

	return {
		all,
		none,
		allWithoutDisable,
		half: !all && !none
	};
};

export const reInitChecked = function(node) {
	if (!node || node.childNodesId.length === 0) return;

	let childNodes = node.getChildNodes(node.childNodesId);
	const {
		all,
		none,
		half
	} = getChildState(childNodes);
	if (all) {
		node.checked = true;
		node.indeterminate = false;
	} else if (half) {
		node.checked = false;
		node.indeterminate = true;
	} else if (none) {
		node.checked = false;
		node.indeterminate = false;
	}

	let parent = node.getParent(node.parentId);
	if (!parent || parent.level === 0) return;

	if (!node.store().checkStrictly) {
		reInitChecked(parent);
	}
};

export const getPropertyFromData = function(node, prop) {
	const props = node.store().props;
	const data = node.data || {};
	const config = props[prop];

	if (typeof config === 'function') {
		return config(data, node);
	} else if (typeof config === 'string') {
		return data[config];
	} else if (typeof config === 'undefined') {
		const dataProp = data[prop];
		return dataProp === undefined ? '' : dataProp;
	}
};

export const isNull = function(v) {
	return v === undefined || v === null || v === '';
}
