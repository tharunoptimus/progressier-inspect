function e(e) {
	try {
		let t = atob(e)
		return JSON.parse(t) || []
	} catch (e) {
		return []
	}
}
importScripts(
	"https://progressier.com/client/resource-matching.js?v=VaFkLYuJYk"
)
const t = "false",
	r = "https://progressier.com",
	n = "false",
	a = e(
		"W3sibmFtZSI6IkltYWdlcyBob3N0ZWQgb24gRmlyZWJhc2UiLCJzdHJhdCI6ImNmciIsImZpbHRlcnMiOltbeyJmaWVsZCI6InVybCIsImNvbXBhcmF0b3IiOiIoLSkiLCJ2YWx1ZSI6Imh0dHBzOi8vZmlyZWJhc2VzdG9yYWdlLmdvb2dsZWFwaXMuY29tLyJ9XV19LHsiZmlsdGVycyI6W1t7InZhbHVlIjoiR0VUIiwiZmllbGQiOiJtZXRob2QiLCJjb21wYXJhdG9yIjoiPT0ifV0sW3sidmFsdWUiOiJodHRwczovL2ZvbnRzLmdvb2dsZWFwaXMuY29tIiwiY29tcGFyYXRvciI6IigtPSkiLCJmaWVsZCI6InVybCJ9LHsidmFsdWUiOiJodHRwczovL2ZvbnRzLmdzdGF0aWMuY29tIiwiY29tcGFyYXRvciI6IigtPSkiLCJmaWVsZCI6InVybCJ9LHsiY29tcGFyYXRvciI6IigtKSIsInZhbHVlIjoiZm9udC1hd2Vzb21lIiwiZmllbGQiOiJ1cmwifSx7InZhbHVlIjoiZm9udCIsImZpZWxkIjoidHlwZSIsImNvbXBhcmF0b3IiOiI9PSJ9XV0sIm5hbWUiOiJGb250IGZpbGVzIiwic3RyYXQiOiJzd3IifV0="
	),
	i = e("W10="),
	s = e("W10="),
	c = e("W10="),
	o = e("W10="),
	u = "progressier-cache",
	l = "progressierPostRequests"
let d = 0
function f() {
	let e = t.toLowerCase()
	return !(!t || "true" !== e)
}
function h(...e) {
	try {
		"true" === n && console.log(...e)
	} catch (e) {}
}
function w() {
	return new Promise(function (e, t) {
		try {
			if (!indexedDB) return null
			let r = indexedDB.open(l, 1)
			;(r.onupgradeneeded = function () {
				try {
					this.result.createObjectStore(l, {
						autoIncrement: !0,
						keyPath: "id",
					})
				} catch (e) {
					h(e)
				}
			}),
				(r.onsuccess = function () {
					try {
						let t = this.result
							.transaction(l, "readwrite")
							.objectStore(l)
						return e(t)
					} catch (e) {
						h(e)
					}
				})
		} catch (e) {
			return h(e), t()
		}
	})
}
function p(e, t) {
	return new Response(null, {
		status: e,
		statusText: t,
		headers: { "cache-control": "no-store" },
	})
}
function y(e, t) {
	try {
		return new ResourceMatching().urlsMatch(e, t)
	} catch (e) {
		return !1
	}
}
async function g() {
	return await caches.open(u)
}
async function m(e, t) {
	try {
		if (!t) return
		if (!new URL(e).protocol.includes("http")) return
		if (
			((n = t.status),
			![0, 200, 201, 202, 203, 204, 205, 206].includes(n))
		)
			return
		if (
			(function (e, t) {
				try {
					if (new URL(e).origin === r) return !1
				} catch (e) {}
				let n = new ResourceMatching().hasNoStore(t),
					a = !1
				return (
					o.forEach(function (t) {
						y(t, e) && (a = !0)
					}),
					!((n && a) || !n)
				)
			})(e, U(t.headers))
		)
			return void h(e, "shouldnt store")
		let a = (function (e) {
				if (0 === e.status) return e.clone()
				let t = e.clone(),
					r = U(t.headers)
				return (
					delete r["cache-control"],
					new Response(t.body, {
						type: t.type || "default",
						status: t.status,
						statusText: t.statusText,
						headers: r,
					})
				)
			})(t),
			i = await g()
		await i.put(e, a)
	} catch (e) {
		h(e)
	}
	var n
}
function v(e) {
	let t = null,
		r = null
	if (
		(c.forEach(function (n) {
			if (t) return
			y(n.original, e) && ((t = n.fallback), (r = n.original))
		}),
		!t)
	)
		return null
	let n = t
	return (
		r.includes("*") ||
			(n = (function (e, t) {
				try {
					let n = new URL(e).searchParams,
						a = new URL(t),
						i = a.searchParams
					for (var r of n.entries()) i.get(r[0]) || i.set(r[0], r[1])
					return a.href
				} catch (e) {
					h(e)
				}
			})(e, t)),
		n || t
	)
}
async function b(e) {
	let t = {}
	;[
		"url",
		"method",
		"referrer",
		"referrerPolicy",
		"mode",
		"credentials",
		"cache",
		"redirect",
		"integrity",
		"destination",
	].forEach(function (r) {
		e[r] && (t[r] = e[r])
	})
	try {
		if (
			(e.headers && e.headers.entries
				? (t.headers = U(e.headers))
				: e.headers &&
				  "object" == typeof e.headers &&
				  (t.headers = JSON.parse(JSON.stringify(e.headers))),
			e.body &&
				(t.body =
					"object" == typeof e.body
						? JSON.stringify(e.body)
						: e.body),
			e.json)
		) {
			let r = await e.json()
			r &&
				"GET" !== e.method &&
				"HEAD" !== e.method &&
				(t.body = JSON.stringify(r))
		}
	} catch (e) {
		h(e)
	}
	return t
}
async function q(e, t) {
	let r = e.request,
		n = r.url,
		a = r.clone()
	try {
		let i = e && e.preloadResponse ? await e.preloadResponse : null
		if (i) return h(e.url, "preload available", i), i
		let s = await fetch(r, { cache: t ? "no-store" : "default" })
		if ((h(s, "network res available"), s && s.status && s.status > 499))
			throw s.statusText || s.status + " Server Error"
		return s
	} catch (e) {
		if ((h(e), "PUT" === r.method || "POST" === r.method)) {
			let e = await (async function (e, t) {
				try {
					let r = v(t)
					if (!r) throw "No fallback URL"
					h("will fetch fallback url", t, r)
					let n = await b(e)
					n.url = r
					let a = new Request(r, n),
						i = await fetch(a)
					return h("successfully fetched fallback url", t, r, i), i
				} catch (e) {
					return null
				}
			})(a, n)
			if (e) return e
		}
		throw e
	}
}
async function R(e, t) {
	let r = await g(),
		n = await r.match(e.request)
	if (n) return n
	let a = e && e.preloadResponse ? await e.preloadResponse : null
	return a || void 0
}
async function E(e) {
	let t = v(e)
	if (!t) return null
	let r = await g(),
		n = await r.match(t)
	return n || null
}
async function P(e) {
	try {
		let t = await q(e, !0)
		return h(e.request.url, "nto retrieved from network", t), t
	} catch (t) {
		return (
			h(e.request.url, "nto not available from network", t),
			p(503, "The server isn't accessible.")
		)
	}
}
async function T(e) {
	let t = e.request.url
	try {
		let r = await q(e, !0)
		return (
			await m(t, r), h(t, "ntf available from network and cached", r), r
		)
	} catch (r) {
		let n = await R(e)
		if (n) return h(t, "ntf fetched from cache", n), n
		let a = await E(t)
		return (
			a ||
			(h(
				t,
				"ntf failed request from network and not available in cache",
				r
			),
			p(
				503,
				"The server isn't accessible and the resource does not exist in cache."
			))
		)
	}
}
async function S(e) {
	let t = e.request.url,
		r = null
	try {
		let n = await R(e)
		if (n) {
			if ((h(t, "cfr available in cache", n), 0 !== n.status)) return n
			h("opaque cached response available cfr", r), (r = n)
		}
		let a = await q(e, !0)
		return (
			await m(e.request.url, a),
			h(t, "cfr retrieved from network and cached", a),
			a
		)
	} catch (e) {
		if (r) return h("returning cached opaque response cfr", r), r
		let n = await E(t)
		return (
			n ||
			p(
				503,
				"The resource does not exist in cache and the server isn't accessible."
			)
		)
	}
}
async function x(e) {
	let t = null,
		r = e.request.url
	try {
		let n = await R(e),
			a = q(e, !0)
		if (
			(e.waitUntil(
				(async function () {
					try {
						let t = await a
						await m(e.request.url, t), h(r, "swr revalidated", t)
					} catch (e) {}
				})()
			),
			n && 0 === n.status)
		)
			h("cached opaque response available", (t = n))
		else if (n) return h(r, "swr available in cache", n), n
		let i = await a,
			s = i.clone()
		return h(r, "swr retrieved from network", i), Promise.resolve(s)
	} catch (e) {
		if (t) return h("returning cached opaque response", t), t
		let n = await E(r)
		return (
			n ||
			p(
				503,
				"The server isn't accessible and the request does not exist in cache"
			)
		)
	}
}
async function L(e) {
	try {
		new URL(e.request.url)
		let r = await e.request.formData(),
			n = (function () {
				let e = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
					t = ""
				for (var r = 0; r < 7; r++)
					t += e.substr(Math.floor(Math.random() * e.length), 1)
				return t
			})(),
			a = {
				id: n,
				url: r.get("url") || "",
				title: r.get("title") || "",
				text: r.get("text") || "",
			},
			i = r.get("file") || ""
		i &&
			((a.buffer = await i.arrayBuffer()),
			(a.type = i.type),
			(a.filename = i.name)),
			await ((t = a),
			new Promise(function (e, r) {
				try {
					let n = "progressiersharedfiles"
					if (!indexedDB) return null
					let a = indexedDB.open(n, 1)
					;(a.onupgradeneeded = function () {
						try {
							this.result.createObjectStore(n, {
								autoIncrement: !0,
								keyPath: "id",
							})
						} catch (e) {
							h(e)
						}
					}),
						(a.onsuccess = function () {
							try {
								let r = this.result
									.transaction(n, "readwrite")
									.objectStore(n)
								return (
									h("storing shared file locally", t),
									r.add(t),
									e()
								)
							} catch (e) {
								h(e)
							}
						})
				} catch (e) {
					return h(e), r()
				}
			}))
		let s = new URL(e.request.url)
		return (
			s.searchParams.set("fileid", n),
			s.searchParams.set("url", a.url),
			s.searchParams.set("title", a.title),
			s.searchParams.set("text", a.text),
			Response.redirect(s.href, 303)
		)
	} catch (t) {
		return Response.redirect(e.request.url, 303)
	}
	var t
}
async function k() {
	try {
		let e = []
		i.forEach(function (t) {
			let r = (async function (e) {
				try {
					let t = await fetch(e)
					h("precaching url", e), await m(e, t)
				} catch (t) {
					h(e + " could not be precached")
				}
			})(t)
			e.push(r)
		}),
			await Promise.all(e)
	} catch (e) {
		h(e)
	}
}
async function O(e, t, r) {
	let n = (function (e, t) {
			try {
				let r = new Date(e).getTime()
				return !((new Date().getTime() - r) / 1e3 > 60 * t * 60)
			} catch (e) {
				return !1
			}
		})(e.date, 24),
		a = function () {
			return !((e.retries || 0) >= 3)
		}
	try {
		if (!n || !a()) throw "must delete request from DB"
		let i = await b(e)
		h("processing request now", e.url, i)
		let s = await fetch(e.url, i)
		if ((h("received response", s), s.status > 499))
			throw (
				((e.handler = t),
				h(
					"retried request return error " + s.status,
					e.url,
					"will try again later"
				),
				"request resulted in a network error")
			)
		return (await w()).delete(e.id), !0
	} catch (t) {
		try {
			e.retries += 1
			let t = await w()
			a() && n && !r
				? (h("retried requests failed", e.retries + " attempts", e.url),
				  t.put(e))
				: t.delete(e.id)
		} catch (e) {
			h(
				"error accessing indexeddb while updating failed retry request number",
				e
			)
		}
		return !1
	}
}
function U(e) {
	let t = {}
	for (var r of e.entries()) {
		t[(r[0] || "").toLowerCase()] = r[1]
	}
	return t
}
function D(e) {
	let t = (e.request.headers["content-type"] || "").split(";")[0],
		r = {
			url: e.request.url,
			method: e.request.method,
			mime: t || "",
			destination: e.request.destination || "",
		},
		n = (function (e) {
			let t = new ResourceMatching().mimes,
				r = t.findIndex((t) => t.fn(e))
			return r < 0 && (r = t.length - 1), r
		})(r)
	r.mimeIndex = n
	let i = null
	return (
		a.forEach(function (e) {
			if (i) return
			let t = 0
			e.filters.forEach(function (e) {
				new ResourceMatching().match(r, e) && (t += 1)
			}),
				t < 1 || (t === e.filters.length && (i = e))
		}),
		i ? i.strat : null
	)
}
self.addEventListener("sync", function (e) {
	var t, r
	h("sync event triggered"),
		e.waitUntil(
			((t = e.lastChance),
			(r = e.tag),
			new Promise(async function (e, n) {
				try {
					let a = [],
						i = await w()
					if (!i || !i.openCursor) return e()
					i.openCursor().onsuccess = async function (i) {
						let s = i.target.result
						if (!s) {
							let t = await Promise.all(a)
							return t.indexOf(!1) > -1
								? n(
										"Some indexedBD requests could not be completed. They will automatically be retried later."
								  )
								: (h(
										t.length +
											" pending requests processed successfully"
								  ),
								  e())
						}
						{
							let e = s.value || {}
							e.handler && e.handler !== r
								? s.continue()
								: (a.push(O(e, r, t)), s.continue())
						}
					}
				} catch (e) {
					return n(
						"Unexpected error processing request in a sync event"
					)
				}
			}))
		)
}),
	self.addEventListener("install", function (e) {
		self.skipWaiting(), e.waitUntil(k())
	}),
	self.addEventListener("fetch", function (e) {
		let t = e.request.url || "",
			n = new URL(t).origin,
			a = self.location.origin,
			i = e.request.method,
			c = e.request.mode,
			o = e.request.cache
		if ("POST" === i && t.includes("progressiersharedcontent=true"))
			return void e.respondWith(L(e))
		if (
			!t.includes("http://") &&
			a === r &&
			"document" === e.request.destination
		)
			return t.includes("/dashboard")
				? void e.respondWith(T(e))
				: void e.respondWith(x(e))
		if (a === r) return
		if (n === r) return void e.respondWith(T(e))
		if (
			t.includes(
				"https://firebasestorage.googleapis.com/v0/b/pwaa-8d87e.appspot.com"
			)
		)
			return (
				h("responding with cache first for firebase storage url", t),
				void e.respondWith(S(e))
			)
		if (
			(function (e, t) {
				let r = !1
				return "POST" !== e && "PUT" !== e
					? r
					: (s.forEach(function (e) {
							y(e, t) && (r = !0)
					  }),
					  r)
			})(i, e.request.url) &&
			indexedDB
		)
			return (
				h("auto retry enable", t),
				void e.respondWith(
					(async function (e) {
						let t = e.request.clone()
						try {
							let r = await P(e)
							if (r.status > 499)
								throw r.statusText || "Server error " + r.status
							return r
						} catch (e) {
							U(t.headers)
							let r = await b(t)
							;(r.date = new Date().toISOString()),
								(r.retries = 0)
							let n = await w()
							return (
								h("request to retry stored in indexdb", r),
								n.add(r),
								p(
									503,
									"The server isn't accessible. The service worker will retry that request later."
								)
							)
						}
					})(e)
				)
			)
		if (("POST" === i || "PUT" === i) && v(e.request.url))
			return h("fallback url mode", t), void e.respondWith(P(e))
		if ("GET" !== i) return
		if ("websocket" === c) return
		if ("only-if-cached" === o && "same-origin" !== i) return
		let u = D(e)
		u &&
			e.respondWith(
				(async function (e, t) {
					switch (e) {
						case "swr":
							return x(t)
						case "cfr":
							return S(t)
						case "ntf":
							return T(t)
						case "nto":
							return P(t)
						default:
							return T(t)
					}
				})(u, e)
			)
	}),
	self.addEventListener("message", function (e) {
		"reset-badge-count" === e.data && ((d = 0), navigator.clearAppBadge())
	}),
	self.addEventListener("push", function (e) {
		if (f()) return void h("Push received but not handled by Progressier")
		if (!self.Notification || "granted" !== self.Notification.permission)
			return
		if (!e.data) return
		try {
			"setAppBadge" in navigator && ((d += 1), navigator.setAppBadge(d))
		} catch (e) {
			h(e)
		}
		try {
			clients.matchAll().then(function (e) {
				e && e[0] && e[0].postMessage("dingding")
			})
		} catch (e) {
			h(e)
		}
		let t = {}
		try {
			t = e.data.json()
		} catch (e) {
			return void h("invalid push data")
		}
		if (!t.title) return void h("missing push title")
		let r = self.registration.showNotification(t.title, t)
		e.waitUntil(r)
	}),
	self.addEventListener("notificationclick", function (e, t) {
		if (f())
			return void h("Notification clicked but not handled by Progressier")
		let r = e.notification.data
		e.notification.close()
		let n = r.url || r.target_url
		if (e.action && r.actions && r.actions.length > 0) {
			let t = r.actions.find((t) => t.action === e.action)
			t.url && (n = t.url)
		}
		n && clients.openWindow(n)
	})
