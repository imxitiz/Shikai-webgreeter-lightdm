/**
 * Dictionary.js
 *
 *
 */

export function update(object, key, value) {
	const keys = key.split(".");

	// Deep clone helper
	const deepClone = (obj) => {
		if (obj === null || typeof obj !== "object") return obj;
		if (Array.isArray(obj)) return obj.map(deepClone);
		const cloned = {};
		for (const k of Object.keys(obj)) {
			cloned[k] = deepClone(obj[k]);
		}
		return cloned;
	};

	const copy = deepClone(object);
	let iter = copy;

	for (let i = 0; i < keys.length; i++) {
		const k = keys[i];
		if (i === keys.length - 1) {
			iter[k] = value;
		} else {
			// Ensure nested object exists
			if (!(k in iter) || iter[k] === null || typeof iter[k] !== "object") {
				iter[k] = {};
			}
			iter = iter[k];
		}
	}

	return copy;
}

export function query(object, key) {
	if (object == null || object === undefined) return undefined;
	const path = key.split(".");
	let current = object;
	for (let i = 0; i < path.length; i++) {
		if (current == null || current === undefined) return undefined;
		current = current[path[i]];
	}
	return current;
}
