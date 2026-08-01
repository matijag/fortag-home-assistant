/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const B = globalThis, F = B.ShadowRoot && (B.ShadyCSS === void 0 || B.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, K = Symbol(), Q = /* @__PURE__ */ new WeakMap();
let lt = class {
  constructor(t, e, r) {
    if (this._$cssResult$ = !0, r !== K) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = e;
  }
  get styleSheet() {
    let t = this.o;
    const e = this.t;
    if (F && t === void 0) {
      const r = e !== void 0 && e.length === 1;
      r && (t = Q.get(e)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), r && Q.set(e, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const gt = (o) => new lt(typeof o == "string" ? o : o + "", void 0, K), _t = (o, ...t) => {
  const e = o.length === 1 ? o[0] : t.reduce((r, s, i) => r + ((n) => {
    if (n._$cssResult$ === !0) return n.cssText;
    if (typeof n == "number") return n;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + n + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(s) + o[i + 1], o[0]);
  return new lt(e, o, K);
}, $t = (o, t) => {
  if (F) o.adoptedStyleSheets = t.map((e) => e instanceof CSSStyleSheet ? e : e.styleSheet);
  else for (const e of t) {
    const r = document.createElement("style"), s = B.litNonce;
    s !== void 0 && r.setAttribute("nonce", s), r.textContent = e.cssText, o.appendChild(r);
  }
}, X = F ? (o) => o : (o) => o instanceof CSSStyleSheet ? ((t) => {
  let e = "";
  for (const r of t.cssRules) e += r.cssText;
  return gt(e);
})(o) : o;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: ft, defineProperty: mt, getOwnPropertyDescriptor: vt, getOwnPropertyNames: yt, getOwnPropertySymbols: bt, getPrototypeOf: At } = Object, v = globalThis, Y = v.trustedTypes, xt = Y ? Y.emptyScript : "", I = v.reactiveElementPolyfillSupport, P = (o, t) => o, D = { toAttribute(o, t) {
  switch (t) {
    case Boolean:
      o = o ? xt : null;
      break;
    case Object:
    case Array:
      o = o == null ? o : JSON.stringify(o);
  }
  return o;
}, fromAttribute(o, t) {
  let e = o;
  switch (t) {
    case Boolean:
      e = o !== null;
      break;
    case Number:
      e = o === null ? null : Number(o);
      break;
    case Object:
    case Array:
      try {
        e = JSON.parse(o);
      } catch {
        e = null;
      }
  }
  return e;
} }, Z = (o, t) => !ft(o, t), tt = { attribute: !0, type: String, converter: D, reflect: !1, useDefault: !1, hasChanged: Z };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), v.litPropertyMetadata ?? (v.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
let w = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ?? (this.l = [])).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, e = tt) {
    if (e.state && (e.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((e = Object.create(e)).wrapped = !0), this.elementProperties.set(t, e), !e.noAccessor) {
      const r = Symbol(), s = this.getPropertyDescriptor(t, r, e);
      s !== void 0 && mt(this.prototype, t, s);
    }
  }
  static getPropertyDescriptor(t, e, r) {
    const { get: s, set: i } = vt(this.prototype, t) ?? { get() {
      return this[e];
    }, set(n) {
      this[e] = n;
    } };
    return { get: s, set(n) {
      const c = s == null ? void 0 : s.call(this);
      i == null || i.call(this, n), this.requestUpdate(t, c, r);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) ?? tt;
  }
  static _$Ei() {
    if (this.hasOwnProperty(P("elementProperties"))) return;
    const t = At(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(P("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(P("properties"))) {
      const e = this.properties, r = [...yt(e), ...bt(e)];
      for (const s of r) this.createProperty(s, e[s]);
    }
    const t = this[Symbol.metadata];
    if (t !== null) {
      const e = litPropertyMetadata.get(t);
      if (e !== void 0) for (const [r, s] of e) this.elementProperties.set(r, s);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [e, r] of this.elementProperties) {
      const s = this._$Eu(e, r);
      s !== void 0 && this._$Eh.set(s, e);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(t) {
    const e = [];
    if (Array.isArray(t)) {
      const r = new Set(t.flat(1 / 0).reverse());
      for (const s of r) e.unshift(X(s));
    } else t !== void 0 && e.push(X(t));
    return e;
  }
  static _$Eu(t, e) {
    const r = e.attribute;
    return r === !1 ? void 0 : typeof r == "string" ? r : typeof t == "string" ? t.toLowerCase() : void 0;
  }
  constructor() {
    super(), this._$Ep = void 0, this.isUpdatePending = !1, this.hasUpdated = !1, this._$Em = null, this._$Ev();
  }
  _$Ev() {
    var t;
    this._$ES = new Promise((e) => this.enableUpdating = e), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), (t = this.constructor.l) == null || t.forEach((e) => e(this));
  }
  addController(t) {
    var e;
    (this._$EO ?? (this._$EO = /* @__PURE__ */ new Set())).add(t), this.renderRoot !== void 0 && this.isConnected && ((e = t.hostConnected) == null || e.call(t));
  }
  removeController(t) {
    var e;
    (e = this._$EO) == null || e.delete(t);
  }
  _$E_() {
    const t = /* @__PURE__ */ new Map(), e = this.constructor.elementProperties;
    for (const r of e.keys()) this.hasOwnProperty(r) && (t.set(r, this[r]), delete this[r]);
    t.size > 0 && (this._$Ep = t);
  }
  createRenderRoot() {
    const t = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return $t(t, this.constructor.elementStyles), t;
  }
  connectedCallback() {
    var t;
    this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this.enableUpdating(!0), (t = this._$EO) == null || t.forEach((e) => {
      var r;
      return (r = e.hostConnected) == null ? void 0 : r.call(e);
    });
  }
  enableUpdating(t) {
  }
  disconnectedCallback() {
    var t;
    (t = this._$EO) == null || t.forEach((e) => {
      var r;
      return (r = e.hostDisconnected) == null ? void 0 : r.call(e);
    });
  }
  attributeChangedCallback(t, e, r) {
    this._$AK(t, r);
  }
  _$ET(t, e) {
    var i;
    const r = this.constructor.elementProperties.get(t), s = this.constructor._$Eu(t, r);
    if (s !== void 0 && r.reflect === !0) {
      const n = (((i = r.converter) == null ? void 0 : i.toAttribute) !== void 0 ? r.converter : D).toAttribute(e, r.type);
      this._$Em = t, n == null ? this.removeAttribute(s) : this.setAttribute(s, n), this._$Em = null;
    }
  }
  _$AK(t, e) {
    var i, n;
    const r = this.constructor, s = r._$Eh.get(t);
    if (s !== void 0 && this._$Em !== s) {
      const c = r.getPropertyOptions(s), a = typeof c.converter == "function" ? { fromAttribute: c.converter } : ((i = c.converter) == null ? void 0 : i.fromAttribute) !== void 0 ? c.converter : D;
      this._$Em = s;
      const d = a.fromAttribute(e, c.type);
      this[s] = d ?? ((n = this._$Ej) == null ? void 0 : n.get(s)) ?? d, this._$Em = null;
    }
  }
  requestUpdate(t, e, r, s = !1, i) {
    var n;
    if (t !== void 0) {
      const c = this.constructor;
      if (s === !1 && (i = this[t]), r ?? (r = c.getPropertyOptions(t)), !((r.hasChanged ?? Z)(i, e) || r.useDefault && r.reflect && i === ((n = this._$Ej) == null ? void 0 : n.get(t)) && !this.hasAttribute(c._$Eu(t, r)))) return;
      this.C(t, e, r);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(t, e, { useDefault: r, reflect: s, wrapped: i }, n) {
    r && !(this._$Ej ?? (this._$Ej = /* @__PURE__ */ new Map())).has(t) && (this._$Ej.set(t, n ?? e ?? this[t]), i !== !0 || n !== void 0) || (this._$AL.has(t) || (this.hasUpdated || r || (e = void 0), this._$AL.set(t, e)), s === !0 && this._$Em !== t && (this._$Eq ?? (this._$Eq = /* @__PURE__ */ new Set())).add(t));
  }
  async _$EP() {
    this.isUpdatePending = !0;
    try {
      await this._$ES;
    } catch (e) {
      Promise.reject(e);
    }
    const t = this.scheduleUpdate();
    return t != null && await t, !this.isUpdatePending;
  }
  scheduleUpdate() {
    return this.performUpdate();
  }
  performUpdate() {
    var r;
    if (!this.isUpdatePending) return;
    if (!this.hasUpdated) {
      if (this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this._$Ep) {
        for (const [i, n] of this._$Ep) this[i] = n;
        this._$Ep = void 0;
      }
      const s = this.constructor.elementProperties;
      if (s.size > 0) for (const [i, n] of s) {
        const { wrapped: c } = n, a = this[i];
        c !== !0 || this._$AL.has(i) || a === void 0 || this.C(i, void 0, n, a);
      }
    }
    let t = !1;
    const e = this._$AL;
    try {
      t = this.shouldUpdate(e), t ? (this.willUpdate(e), (r = this._$EO) == null || r.forEach((s) => {
        var i;
        return (i = s.hostUpdate) == null ? void 0 : i.call(s);
      }), this.update(e)) : this._$EM();
    } catch (s) {
      throw t = !1, this._$EM(), s;
    }
    t && this._$AE(e);
  }
  willUpdate(t) {
  }
  _$AE(t) {
    var e;
    (e = this._$EO) == null || e.forEach((r) => {
      var s;
      return (s = r.hostUpdated) == null ? void 0 : s.call(r);
    }), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(t)), this.updated(t);
  }
  _$EM() {
    this._$AL = /* @__PURE__ */ new Map(), this.isUpdatePending = !1;
  }
  get updateComplete() {
    return this.getUpdateComplete();
  }
  getUpdateComplete() {
    return this._$ES;
  }
  shouldUpdate(t) {
    return !0;
  }
  update(t) {
    this._$Eq && (this._$Eq = this._$Eq.forEach((e) => this._$ET(e, this[e]))), this._$EM();
  }
  updated(t) {
  }
  firstUpdated(t) {
  }
};
w.elementStyles = [], w.shadowRootOptions = { mode: "open" }, w[P("elementProperties")] = /* @__PURE__ */ new Map(), w[P("finalized")] = /* @__PURE__ */ new Map(), I == null || I({ ReactiveElement: w }), (v.reactiveElementVersions ?? (v.reactiveElementVersions = [])).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const U = globalThis, et = (o) => o, z = U.trustedTypes, st = z ? z.createPolicy("lit-html", { createHTML: (o) => o }) : void 0, dt = "$lit$", m = `lit$${Math.random().toFixed(9).slice(2)}$`, ht = "?" + m, wt = `<${ht}>`, x = document, O = () => x.createComment(""), M = (o) => o === null || typeof o != "object" && typeof o != "function", J = Array.isArray, St = (o) => J(o) || typeof (o == null ? void 0 : o[Symbol.iterator]) == "function", W = `[ 	
\f\r]`, k = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, rt = /-->/g, it = />/g, y = RegExp(`>|${W}(?:([^\\s"'>=/]+)(${W}*=${W}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), ot = /'/g, nt = /"/g, pt = /^(?:script|style|textarea|title)$/i, Et = (o) => (t, ...e) => ({ _$litType$: o, strings: t, values: e }), u = Et(1), S = Symbol.for("lit-noChange"), h = Symbol.for("lit-nothing"), at = /* @__PURE__ */ new WeakMap(), b = x.createTreeWalker(x, 129);
function ut(o, t) {
  if (!J(o) || !o.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return st !== void 0 ? st.createHTML(t) : t;
}
const Ct = (o, t) => {
  const e = o.length - 1, r = [];
  let s, i = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", n = k;
  for (let c = 0; c < e; c++) {
    const a = o[c];
    let d, p, l = -1, _ = 0;
    for (; _ < a.length && (n.lastIndex = _, p = n.exec(a), p !== null); ) _ = n.lastIndex, n === k ? p[1] === "!--" ? n = rt : p[1] !== void 0 ? n = it : p[2] !== void 0 ? (pt.test(p[2]) && (s = RegExp("</" + p[2], "g")), n = y) : p[3] !== void 0 && (n = y) : n === y ? p[0] === ">" ? (n = s ?? k, l = -1) : p[1] === void 0 ? l = -2 : (l = n.lastIndex - p[2].length, d = p[1], n = p[3] === void 0 ? y : p[3] === '"' ? nt : ot) : n === nt || n === ot ? n = y : n === rt || n === it ? n = k : (n = y, s = void 0);
    const f = n === y && o[c + 1].startsWith("/>") ? " " : "";
    i += n === k ? a + wt : l >= 0 ? (r.push(d), a.slice(0, l) + dt + a.slice(l) + m + f) : a + m + (l === -2 ? c : f);
  }
  return [ut(o, i + (o[e] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), r];
};
class R {
  constructor({ strings: t, _$litType$: e }, r) {
    let s;
    this.parts = [];
    let i = 0, n = 0;
    const c = t.length - 1, a = this.parts, [d, p] = Ct(t, e);
    if (this.el = R.createElement(d, r), b.currentNode = this.el.content, e === 2 || e === 3) {
      const l = this.el.content.firstChild;
      l.replaceWith(...l.childNodes);
    }
    for (; (s = b.nextNode()) !== null && a.length < c; ) {
      if (s.nodeType === 1) {
        if (s.hasAttributes()) for (const l of s.getAttributeNames()) if (l.endsWith(dt)) {
          const _ = p[n++], f = s.getAttribute(l).split(m), T = /([.?@])?(.*)/.exec(_);
          a.push({ type: 1, index: i, name: T[2], strings: f, ctor: T[1] === "." ? Pt : T[1] === "?" ? Ut : T[1] === "@" ? Nt : j }), s.removeAttribute(l);
        } else l.startsWith(m) && (a.push({ type: 6, index: i }), s.removeAttribute(l));
        if (pt.test(s.tagName)) {
          const l = s.textContent.split(m), _ = l.length - 1;
          if (_ > 0) {
            s.textContent = z ? z.emptyScript : "";
            for (let f = 0; f < _; f++) s.append(l[f], O()), b.nextNode(), a.push({ type: 2, index: ++i });
            s.append(l[_], O());
          }
        }
      } else if (s.nodeType === 8) if (s.data === ht) a.push({ type: 2, index: i });
      else {
        let l = -1;
        for (; (l = s.data.indexOf(m, l + 1)) !== -1; ) a.push({ type: 7, index: i }), l += m.length - 1;
      }
      i++;
    }
  }
  static createElement(t, e) {
    const r = x.createElement("template");
    return r.innerHTML = t, r;
  }
}
function E(o, t, e = o, r) {
  var n, c;
  if (t === S) return t;
  let s = r !== void 0 ? (n = e._$Co) == null ? void 0 : n[r] : e._$Cl;
  const i = M(t) ? void 0 : t._$litDirective$;
  return (s == null ? void 0 : s.constructor) !== i && ((c = s == null ? void 0 : s._$AO) == null || c.call(s, !1), i === void 0 ? s = void 0 : (s = new i(o), s._$AT(o, e, r)), r !== void 0 ? (e._$Co ?? (e._$Co = []))[r] = s : e._$Cl = s), s !== void 0 && (t = E(o, s._$AS(o, t.values), s, r)), t;
}
class kt {
  constructor(t, e) {
    this._$AV = [], this._$AN = void 0, this._$AD = t, this._$AM = e;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(t) {
    const { el: { content: e }, parts: r } = this._$AD, s = ((t == null ? void 0 : t.creationScope) ?? x).importNode(e, !0);
    b.currentNode = s;
    let i = b.nextNode(), n = 0, c = 0, a = r[0];
    for (; a !== void 0; ) {
      if (n === a.index) {
        let d;
        a.type === 2 ? d = new H(i, i.nextSibling, this, t) : a.type === 1 ? d = new a.ctor(i, a.name, a.strings, this, t) : a.type === 6 && (d = new Ot(i, this, t)), this._$AV.push(d), a = r[++c];
      }
      n !== (a == null ? void 0 : a.index) && (i = b.nextNode(), n++);
    }
    return b.currentNode = x, s;
  }
  p(t) {
    let e = 0;
    for (const r of this._$AV) r !== void 0 && (r.strings !== void 0 ? (r._$AI(t, r, e), e += r.strings.length - 2) : r._$AI(t[e])), e++;
  }
}
class H {
  get _$AU() {
    var t;
    return ((t = this._$AM) == null ? void 0 : t._$AU) ?? this._$Cv;
  }
  constructor(t, e, r, s) {
    this.type = 2, this._$AH = h, this._$AN = void 0, this._$AA = t, this._$AB = e, this._$AM = r, this.options = s, this._$Cv = (s == null ? void 0 : s.isConnected) ?? !0;
  }
  get parentNode() {
    let t = this._$AA.parentNode;
    const e = this._$AM;
    return e !== void 0 && (t == null ? void 0 : t.nodeType) === 11 && (t = e.parentNode), t;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(t, e = this) {
    t = E(this, t, e), M(t) ? t === h || t == null || t === "" ? (this._$AH !== h && this._$AR(), this._$AH = h) : t !== this._$AH && t !== S && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : St(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== h && M(this._$AH) ? this._$AA.nextSibling.data = t : this.T(x.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    var i;
    const { values: e, _$litType$: r } = t, s = typeof r == "number" ? this._$AC(t) : (r.el === void 0 && (r.el = R.createElement(ut(r.h, r.h[0]), this.options)), r);
    if (((i = this._$AH) == null ? void 0 : i._$AD) === s) this._$AH.p(e);
    else {
      const n = new kt(s, this), c = n.u(this.options);
      n.p(e), this.T(c), this._$AH = n;
    }
  }
  _$AC(t) {
    let e = at.get(t.strings);
    return e === void 0 && at.set(t.strings, e = new R(t)), e;
  }
  k(t) {
    J(this._$AH) || (this._$AH = [], this._$AR());
    const e = this._$AH;
    let r, s = 0;
    for (const i of t) s === e.length ? e.push(r = new H(this.O(O()), this.O(O()), this, this.options)) : r = e[s], r._$AI(i), s++;
    s < e.length && (this._$AR(r && r._$AB.nextSibling, s), e.length = s);
  }
  _$AR(t = this._$AA.nextSibling, e) {
    var r;
    for ((r = this._$AP) == null ? void 0 : r.call(this, !1, !0, e); t !== this._$AB; ) {
      const s = et(t).nextSibling;
      et(t).remove(), t = s;
    }
  }
  setConnected(t) {
    var e;
    this._$AM === void 0 && (this._$Cv = t, (e = this._$AP) == null || e.call(this, t));
  }
}
class j {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t, e, r, s, i) {
    this.type = 1, this._$AH = h, this._$AN = void 0, this.element = t, this.name = e, this._$AM = s, this.options = i, r.length > 2 || r[0] !== "" || r[1] !== "" ? (this._$AH = Array(r.length - 1).fill(new String()), this.strings = r) : this._$AH = h;
  }
  _$AI(t, e = this, r, s) {
    const i = this.strings;
    let n = !1;
    if (i === void 0) t = E(this, t, e, 0), n = !M(t) || t !== this._$AH && t !== S, n && (this._$AH = t);
    else {
      const c = t;
      let a, d;
      for (t = i[0], a = 0; a < i.length - 1; a++) d = E(this, c[r + a], e, a), d === S && (d = this._$AH[a]), n || (n = !M(d) || d !== this._$AH[a]), d === h ? t = h : t !== h && (t += (d ?? "") + i[a + 1]), this._$AH[a] = d;
    }
    n && !s && this.j(t);
  }
  j(t) {
    t === h ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class Pt extends j {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === h ? void 0 : t;
  }
}
class Ut extends j {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== h);
  }
}
class Nt extends j {
  constructor(t, e, r, s, i) {
    super(t, e, r, s, i), this.type = 5;
  }
  _$AI(t, e = this) {
    if ((t = E(this, t, e, 0) ?? h) === S) return;
    const r = this._$AH, s = t === h && r !== h || t.capture !== r.capture || t.once !== r.once || t.passive !== r.passive, i = t !== h && (r === h || s);
    s && this.element.removeEventListener(this.name, this, r), i && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    var e;
    typeof this._$AH == "function" ? this._$AH.call(((e = this.options) == null ? void 0 : e.host) ?? this.element, t) : this._$AH.handleEvent(t);
  }
}
class Ot {
  constructor(t, e, r) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = e, this.options = r;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    E(this, t);
  }
}
const q = U.litHtmlPolyfillSupport;
q == null || q(R, H), (U.litHtmlVersions ?? (U.litHtmlVersions = [])).push("3.3.3");
const Mt = (o, t, e) => {
  const r = (e == null ? void 0 : e.renderBefore) ?? t;
  let s = r._$litPart$;
  if (s === void 0) {
    const i = (e == null ? void 0 : e.renderBefore) ?? null;
    r._$litPart$ = s = new H(t.insertBefore(O(), i), i, void 0, e ?? {});
  }
  return s._$AI(o), s;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const A = globalThis;
class N extends w {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    var e;
    const t = super.createRenderRoot();
    return (e = this.renderOptions).renderBefore ?? (e.renderBefore = t.firstChild), t;
  }
  update(t) {
    const e = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = Mt(e, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    var t;
    super.connectedCallback(), (t = this._$Do) == null || t.setConnected(!0);
  }
  disconnectedCallback() {
    var t;
    super.disconnectedCallback(), (t = this._$Do) == null || t.setConnected(!1);
  }
  render() {
    return S;
  }
}
var ct;
N._$litElement$ = !0, N.finalized = !0, (ct = A.litElementHydrateSupport) == null || ct.call(A, { LitElement: N });
const V = A.litElementPolyfillSupport;
V == null || V({ LitElement: N });
(A.litElementVersions ?? (A.litElementVersions = [])).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Rt = { attribute: !0, type: String, converter: D, reflect: !1, hasChanged: Z }, Ht = (o = Rt, t, e) => {
  const { kind: r, metadata: s } = e;
  let i = globalThis.litPropertyMetadata.get(s);
  if (i === void 0 && globalThis.litPropertyMetadata.set(s, i = /* @__PURE__ */ new Map()), r === "setter" && ((o = Object.create(o)).wrapped = !0), i.set(e.name, o), r === "accessor") {
    const { name: n } = e;
    return { set(c) {
      const a = t.get.call(this);
      t.set.call(this, c), this.requestUpdate(n, a, o, !0, c);
    }, init(c) {
      return c !== void 0 && this.C(n, void 0, o, c), c;
    } };
  }
  if (r === "setter") {
    const { name: n } = e;
    return function(c) {
      const a = this[n];
      t.call(this, c), this.requestUpdate(n, a, o, !0, c);
    };
  }
  throw Error("Unsupported decorator location: " + r);
};
function L(o) {
  return (t, e) => typeof e == "object" ? Ht(o, t, e) : ((r, s, i) => {
    const n = s.hasOwnProperty(i);
    return s.constructor.createProperty(i, r), n ? Object.getOwnPropertyDescriptor(s, i) : void 0;
  })(o, t, e);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function C(o) {
  return L({ ...o, state: !0, attribute: !1 });
}
var Tt = Object.defineProperty, $ = (o, t, e, r) => {
  for (var s = void 0, i = o.length - 1, n; i >= 0; i--)
    (n = o[i]) && (s = n(t, e, s) || s);
  return s && Tt(t, e, s), s;
};
const G = class G extends N {
  constructor() {
    super(...arguments), this.narrow = !1, this._scanData = null, this._progress = { status: "idle", target: "" }, this._scanning = !1, this._expandedMAC = null, this._editingRange = !1, this._sortBy = "ip";
  }
  async connectedCallback() {
    super.connectedCallback(), this._fetchData(), setInterval(() => this._fetchData(), 1e4);
  }
  async _fetchData() {
    try {
      const t = await this.hass.callWS({ type: "fortag_scanner/get_state" });
      t && (this._scanData = t.state, this._progress = t.progress, this._scanning = this._progress.status !== "idle");
    } catch (t) {
      console.error("Failed to fetch scan data", t);
    }
  }
  async _triggerScan() {
    this._scanning = !0;
    try {
      await this.hass.callWS({ type: "fortag_scanner/scan_now" }), this.dispatchEvent(new CustomEvent("hass-notification", {
        detail: { message: "Network scan triggered successfully" },
        bubbles: !0,
        composed: !0
      }));
    } catch (t) {
      console.error("Failed to trigger scan", t);
    }
  }
  async _updateRange() {
    var r;
    const t = (r = this.shadowRoot) == null ? void 0 : r.querySelector(".range-input"), e = t == null ? void 0 : t.value;
    if (e)
      try {
        await this.hass.callWS({
          type: "fortag_scanner/set_range",
          range: e
        }), this._editingRange = !1, this._fetchData();
      } catch {
        alert("Invalid range or communication error");
      }
  }
  _toggleExpand(t) {
    this._expandedMAC = this._expandedMAC === t ? null : t;
  }
  async _renameHost(t, e) {
    const r = prompt("Enter a new name for this device:", e || "");
    if (!(r === null || r === e))
      try {
        await this.hass.callWS({
          type: "fortag_scanner/rename",
          mac: t,
          name: r
        }), this._scanData && this._scanData.hosts && (this._scanData.hosts = this._scanData.hosts.map((s) => s.mac === t ? { ...s, custom_name: r, is_acknowledged: !0 } : s), this.requestUpdate());
      } catch (s) {
        console.error("Failed to rename host", s);
      }
  }
  async _acknowledge(t, e, r) {
    try {
      await this.hass.callWS({
        type: "fortag_scanner/acknowledge",
        mac: t,
        port: e,
        protocol: r
      }), this._scanData && this._scanData.hosts && (this._scanData.hosts = this._scanData.hosts.map((s) => s.mac === t ? e ? { ...s, ports: s.ports.map((i) => i.port === e && i.protocol === r ? { ...i, is_acknowledged: !0 } : i) } : { ...s, is_acknowledged: !0 } : s), this.requestUpdate());
    } catch (s) {
      console.error("Failed to acknowledge", s);
    }
  }
  _handleSortChange(t) {
    const e = t.target;
    this._sortBy = e.value, this.requestUpdate();
  }
  render() {
    const t = this._scanData, e = this._progress;
    let r = t != null && t.hosts ? [...t.hosts] : [];
    return this._sortBy === "name" ? r.sort((s, i) => {
      const n = (s.custom_name || s.hostname || "Unknown").toLowerCase(), c = (i.custom_name || i.hostname || "Unknown").toLowerCase();
      return n.localeCompare(c);
    }) : this._sortBy === "last_seen" ? r.sort((s, i) => {
      const n = s.last_seen || "";
      return (i.last_seen || "").localeCompare(n);
    }) : this._sortBy === "first_seen" ? r.sort((s, i) => {
      const n = s.created_at || "";
      return (i.created_at || "").localeCompare(n);
    }) : this._sortBy === "ip" ? r.sort((s, i) => {
      const n = (s.ip || "").split(".").map(Number), c = (i.ip || "").split(".").map(Number);
      for (let a = 0; a < 4; a++)
        if ((n[a] || 0) !== (c[a] || 0))
          return (n[a] || 0) - (c[a] || 0);
      return 0;
    }) : this._sortBy === "mac" && r.sort((s, i) => (s.mac || "").localeCompare(i.mac || "")), u`
      <div class="header">
        <h1>Network Security Scanner</h1>
        <div class="range-config">
            <span>Target:</span>
            <input class="range-input" .value="${(t == null ? void 0 : t.scan_range) || ""}" ?disabled="${!this._editingRange}">
            ${this._editingRange ? u`
                <button class="action-btn" @click="${this._updateRange}">Save</button>
                <button class="action-btn" @click="${() => this._editingRange = !1}">Cancel</button>
            ` : u`
                <button class="action-btn" @click="${() => this._editingRange = !0}">Edit</button>
            `}
        </div>
        <button 
          class="main-button"
          @click="${this._triggerScan}" 
          .disabled="${this._scanning}">
          ${this._scanning ? "Scanning..." : "Scan Now"}
        </button>
      </div>

      ${this._scanning ? u`
        <div class="progress-banner">
            <ha-circular-progress active size="small"></ha-circular-progress>
            <span>
                ${e.status === "scanning_hosts" ? `Discovering active hosts in ${e.target}...` : ""}
                ${e.status === "scanning_ports" ? `Analyzing open ports and OS for ${e.target}...` : ""}
            </span>
        </div>
      ` : ""}

      <div class="stats">
        <div class="stat-card">
          <div class="label">Last Full Scan</div>
          <div class="value">${(t == null ? void 0 : t.last_scan) || "Never"}</div>
        </div>
        <div class="stat-card">
          <div class="label">Duration</div>
          <div class="value">${(t == null ? void 0 : t.duration) || "N/A"}</div>
        </div>
        <div class="stat-card">
          <div class="label">Scanner</div>
          <div class="value">${(t == null ? void 0 : t.scanner_version) || "Unknown"} · MQTT API v${(t == null ? void 0 : t.api_version) ?? "?"}</div>
        </div>
      </div>

      <div class="controls-bar" style="display: flex; justify-content: flex-end; align-items: center; margin-bottom: 16px; gap: 8px;">
          <span>Sort by:</span>
          <select @change="${this._handleSortChange}" style="padding: 6px 12px; border-radius: 4px; border: 1px solid var(--divider-color); background: var(--card-background-color); color: var(--primary-text-color); font-size: 0.9em; outline: none; cursor: pointer;">
              <option value="ip" ?selected="${this._sortBy === "ip"}">IP Address</option>
              <option value="name" ?selected="${this._sortBy === "name"}">Host Name</option>
              <option value="last_seen" ?selected="${this._sortBy === "last_seen"}">Last Seen</option>
              <option value="first_seen" ?selected="${this._sortBy === "first_seen"}">First Seen</option>
              <option value="mac" ?selected="${this._sortBy === "mac"}">MAC Address</option>
          </select>
      </div>

      <table class="host-table">
        <thead>
          <tr>
            <th>IP Address</th>
            <th>MAC Address</th>
            <th>Name / Hostname</th>
            <th>OS Guess</th>
            <th>Open Ports</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          ${r.map((s) => {
      var i, n, c;
      return u`
            <tr>
              <td>${s.ip}</td>
              <td><code>${s.mac}</code></td>
              <td>
                <div style="display: flex; flex-direction: column;">
                  <div>
                    ${!s.is_acknowledged && s.is_new_host ? u`
                        <span class="badge badge-new">NEW HOST</span>
                        <button class="ack-btn" @click="${() => this._acknowledge(s.mac)}">ACK</button>
                    ` : ""}
                    ${s.is_randomized ? u`<span class="badge badge-random">RANDOM MAC</span>` : ""}
                  </div>
                  <strong>${s.custom_name || s.hostname || "Unknown"}</strong>
                  <div style="font-size: 0.85em; color: var(--secondary-text-color); margin-top: 4px; line-height: 1.3;">
                    First seen: ${s.created_at || "N/A"}<br>
                    Last seen: ${s.last_seen || "N/A"}
                  </div>
                </div>
              </td>
              <td>${s.os || "Unknown"}</td>
              <td>
                ${(i = s.ports) == null ? void 0 : i.map((a) => u`
                  <div style="display: flex; align-items: center; gap: 4px; margin-bottom: 2px;">
                    ${!a.is_acknowledged && a.is_new ? u`<span style="color: var(--error-color); font-weight: bold;">[NEW]</span>` : ""}
                    ${a.port}/${a.protocol} (${a.service})
                    ${!a.is_acknowledged && a.is_new ? u`
                        <button class="ack-btn" @click="${() => this._acknowledge(s.mac, a.port, a.protocol)}">ACK</button>
                    ` : ""}
                  </div>
                `)}
              </td>
              <td>
                <button class="action-btn" @click="${() => this._toggleExpand(s.mac)}">
                  ${this._expandedMAC === s.mac ? "Hide Details" : "Details"}
                </button>
                <button class="action-btn" @click="${() => this._renameHost(s.mac, s.custom_name || s.hostname)}">
                  Rename
                </button>
              </td>
            </tr>
            ${this._expandedMAC === s.mac ? u`
              <tr class="details-row">
                <td colspan="6">
                  <div class="details-container">
                    <strong>Extended Analysis for ${s.mac}:</strong>
                    <div class="details-content">
${(n = s.ports) == null ? void 0 : n.filter((a) => a.scripts).map((a) => u`
[Port ${a.port}/${a.protocol}]
${a.scripts}
`)}
${(c = s.ports) != null && c.some((a) => a.scripts) ? "" : "No extended script data available."}
                    </div>
                  </div>
                </td>
              </tr>
            ` : ""}
          `;
    })}
        </tbody>
      </table>
    `;
  }
};
G.styles = _t`
    :host {
      display: block;
      padding: 16px;
      background-color: var(--primary-background-color);
      color: var(--primary-text-color);
      font-family: var(--paper-font-body1_-_font-family);
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
      border-bottom: 1px solid var(--divider-color);
      padding-bottom: 16px;
    }
    .progress-banner {
        background: var(--primary-color);
        color: white;
        padding: 12px;
        border-radius: 8px;
        margin-bottom: 16px;
        display: flex;
        align-items: center;
        gap: 12px;
        font-weight: bold;
        animation: pulse 2s infinite;
    }
    @keyframes pulse {
        0% { opacity: 0.9; }
        50% { opacity: 1; }
        100% { opacity: 0.9; }
    }
    .stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;
      margin-bottom: 24px;
    }
    .stat-card {
      background: var(--card-background-color);
      padding: 16px;
      border-radius: 8px;
      box-shadow: var(--ha-card-box-shadow, 0 2px 2px 0 rgba(0,0,0,0.14));
    }
    .range-config {
        display: flex;
        align-items: center;
        gap: 8px;
    }
    .range-input {
        background: var(--secondary-background-color);
        color: var(--primary-text-color);
        border: 1px solid var(--divider-color);
        padding: 4px 8px;
        border-radius: 4px;
    }
    .host-table {
      width: 100%;
      border-collapse: collapse;
      background: var(--card-background-color);
      border-radius: 8px;
      overflow: hidden;
    }
    th, td {
      text-align: left;
      padding: 12px;
      border-bottom: 1px solid var(--divider-color);
    }
    th {
      background: var(--secondary-background-color);
      font-weight: bold;
    }
    tr.details-row td {
      background: var(--secondary-background-color);
      padding: 0;
    }
    .details-container {
      padding: 16px;
      background: var(--primary-background-color);
      border: 1px solid var(--divider-color);
      margin: 8px;
      border-radius: 4px;
    }
    .details-content {
      font-family: 'Courier New', Courier, monospace;
      white-space: pre-wrap;
      font-size: 0.85em;
      line-height: 1.4;
      max-height: 400px;
      overflow-y: auto;
      padding: 10px;
      background: #000;
      color: #0f0;
      border-radius: 4px;
    }
    .badge {
      padding: 2px 8px;
      border-radius: 12px;
      font-size: 0.8em;
      font-weight: bold;
      margin-right: 4px;
    }
    .badge-new { background: var(--error-color); color: white; }
    .badge-random { background: var(--warning-color); color: black; }
    
    .action-btn {
      background: var(--secondary-background-color);
      color: var(--primary-text-color);
      border: 1px solid var(--divider-color);
      padding: 4px 8px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 0.85em;
      margin-right: 4px;
    }
    .action-btn:hover {
      background: var(--primary-color);
      color: white;
    }
    .ack-btn {
      background: var(--warning-color);
      color: black;
      border: none;
      padding: 2px 6px;
      border-radius: 4px;
      font-size: 0.75em;
      cursor: pointer;
      font-weight: bold;
      margin-left: 4px;
    }

    .main-button {
      background: var(--primary-color);
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 4px;
      cursor: pointer;
      font-weight: bold;
    }
    .main-button:hover { opacity: 0.9; }
    .main-button:disabled { background: var(--disabled-text-color); cursor: not-allowed; }
  `;
let g = G;
$([
  L({ type: Object })
], g.prototype, "hass");
$([
  L({ type: Boolean })
], g.prototype, "narrow");
$([
  L({ type: Object })
], g.prototype, "panel");
$([
  C()
], g.prototype, "_scanData");
$([
  C()
], g.prototype, "_progress");
$([
  C()
], g.prototype, "_scanning");
$([
  C()
], g.prototype, "_expandedMAC");
$([
  C()
], g.prototype, "_editingRange");
$([
  C()
], g.prototype, "_sortBy");
customElements.get("fortag-scanner-panel") || customElements.define("fortag-scanner-panel", g);
export {
  g as FortagPanel
};
