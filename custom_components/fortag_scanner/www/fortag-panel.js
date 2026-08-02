/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const T = globalThis, F = T.ShadowRoot && (T.ShadyCSS === void 0 || T.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, K = Symbol(), Q = /* @__PURE__ */ new WeakMap();
let lt = class {
  constructor(t, e, i) {
    if (this._$cssResult$ = !0, i !== K) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = e;
  }
  get styleSheet() {
    let t = this.o;
    const e = this.t;
    if (F && t === void 0) {
      const i = e !== void 0 && e.length === 1;
      i && (t = Q.get(e)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), i && Q.set(e, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const gt = (n) => new lt(typeof n == "string" ? n : n + "", void 0, K), _t = (n, ...t) => {
  const e = n.length === 1 ? n[0] : t.reduce((i, s, r) => i + ((o) => {
    if (o._$cssResult$ === !0) return o.cssText;
    if (typeof o == "number") return o;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + o + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(s) + n[r + 1], n[0]);
  return new lt(e, n, K);
}, $t = (n, t) => {
  if (F) n.adoptedStyleSheets = t.map((e) => e instanceof CSSStyleSheet ? e : e.styleSheet);
  else for (const e of t) {
    const i = document.createElement("style"), s = T.litNonce;
    s !== void 0 && i.setAttribute("nonce", s), i.textContent = e.cssText, n.appendChild(i);
  }
}, X = F ? (n) => n : (n) => n instanceof CSSStyleSheet ? ((t) => {
  let e = "";
  for (const i of t.cssRules) e += i.cssText;
  return gt(e);
})(n) : n;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: ft, defineProperty: mt, getOwnPropertyDescriptor: vt, getOwnPropertyNames: bt, getOwnPropertySymbols: yt, getPrototypeOf: At } = Object, v = globalThis, Y = v.trustedTypes, xt = Y ? Y.emptyScript : "", L = v.reactiveElementPolyfillSupport, P = (n, t) => n, z = { toAttribute(n, t) {
  switch (t) {
    case Boolean:
      n = n ? xt : null;
      break;
    case Object:
    case Array:
      n = n == null ? n : JSON.stringify(n);
  }
  return n;
}, fromAttribute(n, t) {
  let e = n;
  switch (t) {
    case Boolean:
      e = n !== null;
      break;
    case Number:
      e = n === null ? null : Number(n);
      break;
    case Object:
    case Array:
      try {
        e = JSON.parse(n);
      } catch {
        e = null;
      }
  }
  return e;
} }, Z = (n, t) => !ft(n, t), tt = { attribute: !0, type: String, converter: z, reflect: !1, useDefault: !1, hasChanged: Z };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), v.litPropertyMetadata ?? (v.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
let S = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ?? (this.l = [])).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, e = tt) {
    if (e.state && (e.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((e = Object.create(e)).wrapped = !0), this.elementProperties.set(t, e), !e.noAccessor) {
      const i = Symbol(), s = this.getPropertyDescriptor(t, i, e);
      s !== void 0 && mt(this.prototype, t, s);
    }
  }
  static getPropertyDescriptor(t, e, i) {
    const { get: s, set: r } = vt(this.prototype, t) ?? { get() {
      return this[e];
    }, set(o) {
      this[e] = o;
    } };
    return { get: s, set(o) {
      const c = s == null ? void 0 : s.call(this);
      r == null || r.call(this, o), this.requestUpdate(t, c, i);
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
      const e = this.properties, i = [...bt(e), ...yt(e)];
      for (const s of i) this.createProperty(s, e[s]);
    }
    const t = this[Symbol.metadata];
    if (t !== null) {
      const e = litPropertyMetadata.get(t);
      if (e !== void 0) for (const [i, s] of e) this.elementProperties.set(i, s);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [e, i] of this.elementProperties) {
      const s = this._$Eu(e, i);
      s !== void 0 && this._$Eh.set(s, e);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(t) {
    const e = [];
    if (Array.isArray(t)) {
      const i = new Set(t.flat(1 / 0).reverse());
      for (const s of i) e.unshift(X(s));
    } else t !== void 0 && e.push(X(t));
    return e;
  }
  static _$Eu(t, e) {
    const i = e.attribute;
    return i === !1 ? void 0 : typeof i == "string" ? i : typeof t == "string" ? t.toLowerCase() : void 0;
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
    for (const i of e.keys()) this.hasOwnProperty(i) && (t.set(i, this[i]), delete this[i]);
    t.size > 0 && (this._$Ep = t);
  }
  createRenderRoot() {
    const t = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return $t(t, this.constructor.elementStyles), t;
  }
  connectedCallback() {
    var t;
    this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this.enableUpdating(!0), (t = this._$EO) == null || t.forEach((e) => {
      var i;
      return (i = e.hostConnected) == null ? void 0 : i.call(e);
    });
  }
  enableUpdating(t) {
  }
  disconnectedCallback() {
    var t;
    (t = this._$EO) == null || t.forEach((e) => {
      var i;
      return (i = e.hostDisconnected) == null ? void 0 : i.call(e);
    });
  }
  attributeChangedCallback(t, e, i) {
    this._$AK(t, i);
  }
  _$ET(t, e) {
    var r;
    const i = this.constructor.elementProperties.get(t), s = this.constructor._$Eu(t, i);
    if (s !== void 0 && i.reflect === !0) {
      const o = (((r = i.converter) == null ? void 0 : r.toAttribute) !== void 0 ? i.converter : z).toAttribute(e, i.type);
      this._$Em = t, o == null ? this.removeAttribute(s) : this.setAttribute(s, o), this._$Em = null;
    }
  }
  _$AK(t, e) {
    var r, o;
    const i = this.constructor, s = i._$Eh.get(t);
    if (s !== void 0 && this._$Em !== s) {
      const c = i.getPropertyOptions(s), a = typeof c.converter == "function" ? { fromAttribute: c.converter } : ((r = c.converter) == null ? void 0 : r.fromAttribute) !== void 0 ? c.converter : z;
      this._$Em = s;
      const d = a.fromAttribute(e, c.type);
      this[s] = d ?? ((o = this._$Ej) == null ? void 0 : o.get(s)) ?? d, this._$Em = null;
    }
  }
  requestUpdate(t, e, i, s = !1, r) {
    var o;
    if (t !== void 0) {
      const c = this.constructor;
      if (s === !1 && (r = this[t]), i ?? (i = c.getPropertyOptions(t)), !((i.hasChanged ?? Z)(r, e) || i.useDefault && i.reflect && r === ((o = this._$Ej) == null ? void 0 : o.get(t)) && !this.hasAttribute(c._$Eu(t, i)))) return;
      this.C(t, e, i);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(t, e, { useDefault: i, reflect: s, wrapped: r }, o) {
    i && !(this._$Ej ?? (this._$Ej = /* @__PURE__ */ new Map())).has(t) && (this._$Ej.set(t, o ?? e ?? this[t]), r !== !0 || o !== void 0) || (this._$AL.has(t) || (this.hasUpdated || i || (e = void 0), this._$AL.set(t, e)), s === !0 && this._$Em !== t && (this._$Eq ?? (this._$Eq = /* @__PURE__ */ new Set())).add(t));
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
    var i;
    if (!this.isUpdatePending) return;
    if (!this.hasUpdated) {
      if (this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this._$Ep) {
        for (const [r, o] of this._$Ep) this[r] = o;
        this._$Ep = void 0;
      }
      const s = this.constructor.elementProperties;
      if (s.size > 0) for (const [r, o] of s) {
        const { wrapped: c } = o, a = this[r];
        c !== !0 || this._$AL.has(r) || a === void 0 || this.C(r, void 0, o, a);
      }
    }
    let t = !1;
    const e = this._$AL;
    try {
      t = this.shouldUpdate(e), t ? (this.willUpdate(e), (i = this._$EO) == null || i.forEach((s) => {
        var r;
        return (r = s.hostUpdate) == null ? void 0 : r.call(s);
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
    (e = this._$EO) == null || e.forEach((i) => {
      var s;
      return (s = i.hostUpdated) == null ? void 0 : s.call(i);
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
S.elementStyles = [], S.shadowRootOptions = { mode: "open" }, S[P("elementProperties")] = /* @__PURE__ */ new Map(), S[P("finalized")] = /* @__PURE__ */ new Map(), L == null || L({ ReactiveElement: S }), (v.reactiveElementVersions ?? (v.reactiveElementVersions = [])).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const U = globalThis, et = (n) => n, j = U.trustedTypes, st = j ? j.createPolicy("lit-html", { createHTML: (n) => n }) : void 0, dt = "$lit$", m = `lit$${Math.random().toFixed(9).slice(2)}$`, ht = "?" + m, wt = `<${ht}>`, x = document, O = () => x.createComment(""), M = (n) => n === null || typeof n != "object" && typeof n != "function", J = Array.isArray, St = (n) => J(n) || typeof (n == null ? void 0 : n[Symbol.iterator]) == "function", W = `[ 	
\f\r]`, C = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, it = /-->/g, rt = />/g, b = RegExp(`>|${W}(?:([^\\s"'>=/]+)(${W}*=${W}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), ot = /'/g, nt = /"/g, pt = /^(?:script|style|textarea|title)$/i, Et = (n) => (t, ...e) => ({ _$litType$: n, strings: t, values: e }), g = Et(1), E = Symbol.for("lit-noChange"), h = Symbol.for("lit-nothing"), at = /* @__PURE__ */ new WeakMap(), y = x.createTreeWalker(x, 129);
function ut(n, t) {
  if (!J(n) || !n.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return st !== void 0 ? st.createHTML(t) : t;
}
const kt = (n, t) => {
  const e = n.length - 1, i = [];
  let s, r = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", o = C;
  for (let c = 0; c < e; c++) {
    const a = n[c];
    let d, p, l = -1, $ = 0;
    for (; $ < a.length && (o.lastIndex = $, p = o.exec(a), p !== null); ) $ = o.lastIndex, o === C ? p[1] === "!--" ? o = it : p[1] !== void 0 ? o = rt : p[2] !== void 0 ? (pt.test(p[2]) && (s = RegExp("</" + p[2], "g")), o = b) : p[3] !== void 0 && (o = b) : o === b ? p[0] === ">" ? (o = s ?? C, l = -1) : p[1] === void 0 ? l = -2 : (l = o.lastIndex - p[2].length, d = p[1], o = p[3] === void 0 ? b : p[3] === '"' ? nt : ot) : o === nt || o === ot ? o = b : o === it || o === rt ? o = C : (o = b, s = void 0);
    const f = o === b && n[c + 1].startsWith("/>") ? " " : "";
    r += o === C ? a + wt : l >= 0 ? (i.push(d), a.slice(0, l) + dt + a.slice(l) + m + f) : a + m + (l === -2 ? c : f);
  }
  return [ut(n, r + (n[e] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), i];
};
class R {
  constructor({ strings: t, _$litType$: e }, i) {
    let s;
    this.parts = [];
    let r = 0, o = 0;
    const c = t.length - 1, a = this.parts, [d, p] = kt(t, e);
    if (this.el = R.createElement(d, i), y.currentNode = this.el.content, e === 2 || e === 3) {
      const l = this.el.content.firstChild;
      l.replaceWith(...l.childNodes);
    }
    for (; (s = y.nextNode()) !== null && a.length < c; ) {
      if (s.nodeType === 1) {
        if (s.hasAttributes()) for (const l of s.getAttributeNames()) if (l.endsWith(dt)) {
          const $ = p[o++], f = s.getAttribute(l).split(m), D = /([.?@])?(.*)/.exec($);
          a.push({ type: 1, index: r, name: D[2], strings: f, ctor: D[1] === "." ? Pt : D[1] === "?" ? Ut : D[1] === "@" ? Nt : B }), s.removeAttribute(l);
        } else l.startsWith(m) && (a.push({ type: 6, index: r }), s.removeAttribute(l));
        if (pt.test(s.tagName)) {
          const l = s.textContent.split(m), $ = l.length - 1;
          if ($ > 0) {
            s.textContent = j ? j.emptyScript : "";
            for (let f = 0; f < $; f++) s.append(l[f], O()), y.nextNode(), a.push({ type: 2, index: ++r });
            s.append(l[$], O());
          }
        }
      } else if (s.nodeType === 8) if (s.data === ht) a.push({ type: 2, index: r });
      else {
        let l = -1;
        for (; (l = s.data.indexOf(m, l + 1)) !== -1; ) a.push({ type: 7, index: r }), l += m.length - 1;
      }
      r++;
    }
  }
  static createElement(t, e) {
    const i = x.createElement("template");
    return i.innerHTML = t, i;
  }
}
function k(n, t, e = n, i) {
  var o, c;
  if (t === E) return t;
  let s = i !== void 0 ? (o = e._$Co) == null ? void 0 : o[i] : e._$Cl;
  const r = M(t) ? void 0 : t._$litDirective$;
  return (s == null ? void 0 : s.constructor) !== r && ((c = s == null ? void 0 : s._$AO) == null || c.call(s, !1), r === void 0 ? s = void 0 : (s = new r(n), s._$AT(n, e, i)), i !== void 0 ? (e._$Co ?? (e._$Co = []))[i] = s : e._$Cl = s), s !== void 0 && (t = k(n, s._$AS(n, t.values), s, i)), t;
}
class Ct {
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
    const { el: { content: e }, parts: i } = this._$AD, s = ((t == null ? void 0 : t.creationScope) ?? x).importNode(e, !0);
    y.currentNode = s;
    let r = y.nextNode(), o = 0, c = 0, a = i[0];
    for (; a !== void 0; ) {
      if (o === a.index) {
        let d;
        a.type === 2 ? d = new H(r, r.nextSibling, this, t) : a.type === 1 ? d = new a.ctor(r, a.name, a.strings, this, t) : a.type === 6 && (d = new Ot(r, this, t)), this._$AV.push(d), a = i[++c];
      }
      o !== (a == null ? void 0 : a.index) && (r = y.nextNode(), o++);
    }
    return y.currentNode = x, s;
  }
  p(t) {
    let e = 0;
    for (const i of this._$AV) i !== void 0 && (i.strings !== void 0 ? (i._$AI(t, i, e), e += i.strings.length - 2) : i._$AI(t[e])), e++;
  }
}
class H {
  get _$AU() {
    var t;
    return ((t = this._$AM) == null ? void 0 : t._$AU) ?? this._$Cv;
  }
  constructor(t, e, i, s) {
    this.type = 2, this._$AH = h, this._$AN = void 0, this._$AA = t, this._$AB = e, this._$AM = i, this.options = s, this._$Cv = (s == null ? void 0 : s.isConnected) ?? !0;
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
    t = k(this, t, e), M(t) ? t === h || t == null || t === "" ? (this._$AH !== h && this._$AR(), this._$AH = h) : t !== this._$AH && t !== E && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : St(t) ? this.k(t) : this._(t);
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
    var r;
    const { values: e, _$litType$: i } = t, s = typeof i == "number" ? this._$AC(t) : (i.el === void 0 && (i.el = R.createElement(ut(i.h, i.h[0]), this.options)), i);
    if (((r = this._$AH) == null ? void 0 : r._$AD) === s) this._$AH.p(e);
    else {
      const o = new Ct(s, this), c = o.u(this.options);
      o.p(e), this.T(c), this._$AH = o;
    }
  }
  _$AC(t) {
    let e = at.get(t.strings);
    return e === void 0 && at.set(t.strings, e = new R(t)), e;
  }
  k(t) {
    J(this._$AH) || (this._$AH = [], this._$AR());
    const e = this._$AH;
    let i, s = 0;
    for (const r of t) s === e.length ? e.push(i = new H(this.O(O()), this.O(O()), this, this.options)) : i = e[s], i._$AI(r), s++;
    s < e.length && (this._$AR(i && i._$AB.nextSibling, s), e.length = s);
  }
  _$AR(t = this._$AA.nextSibling, e) {
    var i;
    for ((i = this._$AP) == null ? void 0 : i.call(this, !1, !0, e); t !== this._$AB; ) {
      const s = et(t).nextSibling;
      et(t).remove(), t = s;
    }
  }
  setConnected(t) {
    var e;
    this._$AM === void 0 && (this._$Cv = t, (e = this._$AP) == null || e.call(this, t));
  }
}
class B {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t, e, i, s, r) {
    this.type = 1, this._$AH = h, this._$AN = void 0, this.element = t, this.name = e, this._$AM = s, this.options = r, i.length > 2 || i[0] !== "" || i[1] !== "" ? (this._$AH = Array(i.length - 1).fill(new String()), this.strings = i) : this._$AH = h;
  }
  _$AI(t, e = this, i, s) {
    const r = this.strings;
    let o = !1;
    if (r === void 0) t = k(this, t, e, 0), o = !M(t) || t !== this._$AH && t !== E, o && (this._$AH = t);
    else {
      const c = t;
      let a, d;
      for (t = r[0], a = 0; a < r.length - 1; a++) d = k(this, c[i + a], e, a), d === E && (d = this._$AH[a]), o || (o = !M(d) || d !== this._$AH[a]), d === h ? t = h : t !== h && (t += (d ?? "") + r[a + 1]), this._$AH[a] = d;
    }
    o && !s && this.j(t);
  }
  j(t) {
    t === h ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class Pt extends B {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === h ? void 0 : t;
  }
}
class Ut extends B {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== h);
  }
}
class Nt extends B {
  constructor(t, e, i, s, r) {
    super(t, e, i, s, r), this.type = 5;
  }
  _$AI(t, e = this) {
    if ((t = k(this, t, e, 0) ?? h) === E) return;
    const i = this._$AH, s = t === h && i !== h || t.capture !== i.capture || t.once !== i.once || t.passive !== i.passive, r = t !== h && (i === h || s);
    s && this.element.removeEventListener(this.name, this, i), r && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    var e;
    typeof this._$AH == "function" ? this._$AH.call(((e = this.options) == null ? void 0 : e.host) ?? this.element, t) : this._$AH.handleEvent(t);
  }
}
class Ot {
  constructor(t, e, i) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = e, this.options = i;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    k(this, t);
  }
}
const q = U.litHtmlPolyfillSupport;
q == null || q(R, H), (U.litHtmlVersions ?? (U.litHtmlVersions = [])).push("3.3.3");
const Mt = (n, t, e) => {
  const i = (e == null ? void 0 : e.renderBefore) ?? t;
  let s = i._$litPart$;
  if (s === void 0) {
    const r = (e == null ? void 0 : e.renderBefore) ?? null;
    i._$litPart$ = s = new H(t.insertBefore(O(), r), r, void 0, e ?? {});
  }
  return s._$AI(n), s;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const A = globalThis;
class N extends S {
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
    return E;
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
const Rt = { attribute: !0, type: String, converter: z, reflect: !1, hasChanged: Z }, Ht = (n = Rt, t, e) => {
  const { kind: i, metadata: s } = e;
  let r = globalThis.litPropertyMetadata.get(s);
  if (r === void 0 && globalThis.litPropertyMetadata.set(s, r = /* @__PURE__ */ new Map()), i === "setter" && ((n = Object.create(n)).wrapped = !0), r.set(e.name, n), i === "accessor") {
    const { name: o } = e;
    return { set(c) {
      const a = t.get.call(this);
      t.set.call(this, c), this.requestUpdate(o, a, n, !0, c);
    }, init(c) {
      return c !== void 0 && this.C(o, void 0, n, c), c;
    } };
  }
  if (i === "setter") {
    const { name: o } = e;
    return function(c) {
      const a = this[o];
      t.call(this, c), this.requestUpdate(o, a, n, !0, c);
    };
  }
  throw Error("Unsupported decorator location: " + i);
};
function I(n) {
  return (t, e) => typeof e == "object" ? Ht(n, t, e) : ((i, s, r) => {
    const o = s.hasOwnProperty(r);
    return s.constructor.createProperty(r, i), o ? Object.getOwnPropertyDescriptor(s, r) : void 0;
  })(n, t, e);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function w(n) {
  return I({ ...n, state: !0, attribute: !1 });
}
var Dt = Object.defineProperty, _ = (n, t, e, i) => {
  for (var s = void 0, r = n.length - 1, o; r >= 0; r--)
    (o = n[r]) && (s = o(t, e, s) || s);
  return s && Dt(t, e, s), s;
};
const G = class G extends N {
  constructor() {
    super(...arguments), this.narrow = !1, this._scanData = null, this._progress = { status: "idle", target: "" }, this._scanning = !1, this._expandedMAC = null, this._editingRange = !1, this._sortBy = "ip", this._sortDirection = "asc";
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
    var i;
    const t = (i = this.shadowRoot) == null ? void 0 : i.querySelector(".range-input"), e = t == null ? void 0 : t.value;
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
    const i = prompt("Enter a new name for this device:", e || "");
    if (!(i === null || i === e))
      try {
        await this.hass.callWS({
          type: "fortag_scanner/rename",
          mac: t,
          name: i
        }), this._scanData && this._scanData.hosts && (this._scanData.hosts = this._scanData.hosts.map((s) => s.mac === t ? { ...s, custom_name: i, is_acknowledged: !0 } : s), this.requestUpdate());
      } catch (s) {
        console.error("Failed to rename host", s);
      }
  }
  async _acknowledge(t, e, i) {
    try {
      await this.hass.callWS({
        type: "fortag_scanner/acknowledge",
        mac: t,
        port: e,
        protocol: i
      }), this._scanData && this._scanData.hosts && (this._scanData.hosts = this._scanData.hosts.map((s) => s.mac === t ? e ? { ...s, ports: s.ports.map((r) => r.port === e && r.protocol === i ? { ...r, is_acknowledged: !0 } : r) } : { ...s, is_acknowledged: !0 } : s), this.requestUpdate());
    } catch (s) {
      console.error("Failed to acknowledge", s);
    }
  }
  _handleSortChange(t) {
    const e = t.target;
    this._sortBy = e.value;
  }
  _toggleSortDirection() {
    this._sortDirection = this._sortDirection === "asc" ? "desc" : "asc";
  }
  _compareIPs(t, e) {
    const i = t.split(".").map(Number), s = e.split(".").map(Number);
    for (let r = 0; r < 4; r++) {
      const o = (i[r] || 0) - (s[r] || 0);
      if (o !== 0) return o;
    }
    return 0;
  }
  _sortHosts(t) {
    const e = this._sortDirection === "asc" ? 1 : -1;
    return [...t].sort((i, s) => {
      let r = "", o = "", c = 0;
      return this._sortBy === "name" ? (r = i.custom_name || i.hostname || "Unknown", o = s.custom_name || s.hostname || "Unknown", c = r.localeCompare(o, void 0, { sensitivity: "base", numeric: !0 })) : this._sortBy === "ip" ? (r = i.ip || "", o = s.ip || "", c = this._compareIPs(r, o)) : this._sortBy === "first_seen" ? (r = i.created_at || "", o = s.created_at || "", c = r.localeCompare(o)) : (r = i.last_seen || "", o = s.last_seen || "", c = r.localeCompare(o)), !r && o ? 1 : r && !o ? -1 : c !== 0 ? c * e : this._compareIPs(i.ip || "", s.ip || "");
    });
  }
  render() {
    const t = this._scanData, e = this._progress, i = this._sortHosts((t == null ? void 0 : t.hosts) || []);
    return g`
      <div class="header">
        <h1>Network Security Scanner</h1>
        <div class="range-config">
            <span>Target:</span>
            <input class="range-input" .value="${(t == null ? void 0 : t.scan_range) || ""}" ?disabled="${!this._editingRange}">
            ${this._editingRange ? g`
                <button class="action-btn" @click="${this._updateRange}">Save</button>
                <button class="action-btn" @click="${() => this._editingRange = !1}">Cancel</button>
            ` : g`
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

      ${this._scanning ? g`
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

      <div class="controls-bar">
          <span>Sort by:</span>
          <select class="sort-select" .value="${this._sortBy}" @change="${this._handleSortChange}" aria-label="Sort hosts by">
              <option value="name">Name</option>
              <option value="ip">IP Address</option>
              <option value="first_seen">First Detected</option>
              <option value="last_seen">Last Detected</option>
          </select>
          <button
            class="action-btn sort-direction"
            @click="${this._toggleSortDirection}"
            title="Reverse sort direction"
            aria-label="Sort ${this._sortDirection === "asc" ? "ascending" : "descending"}; click to reverse">
            ${this._sortDirection === "asc" ? "Ascending ↑" : "Descending ↓"}
          </button>
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
          ${i.map((s) => {
      var r, o, c;
      return g`
            <tr>
              <td>${s.ip}</td>
              <td><code>${s.mac}</code></td>
              <td>
                <div style="display: flex; flex-direction: column;">
                  <div>
                    ${!s.is_acknowledged && s.is_new_host ? g`
                        <span class="badge badge-new">NEW HOST</span>
                        <button class="ack-btn" @click="${() => this._acknowledge(s.mac)}">ACK</button>
                    ` : ""}
                    ${s.is_randomized ? g`<span class="badge badge-random">RANDOM MAC</span>` : ""}
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
                ${(r = s.ports) == null ? void 0 : r.map((a) => g`
                  <div style="display: flex; align-items: center; gap: 4px; margin-bottom: 2px;">
                    ${!a.is_acknowledged && a.is_new ? g`<span style="color: var(--error-color); font-weight: bold;">[NEW]</span>` : ""}
                    ${a.port}/${a.protocol} (${a.service})
                    ${!a.is_acknowledged && a.is_new ? g`
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
            ${this._expandedMAC === s.mac ? g`
              <tr class="details-row">
                <td colspan="6">
                  <div class="details-container">
                    <strong>Extended Analysis for ${s.mac}:</strong>
                    <div class="details-content">
${(o = s.ports) == null ? void 0 : o.filter((a) => a.scripts).map((a) => g`
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
    .controls-bar {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      margin-bottom: 16px;
      gap: 8px;
    }
    .sort-select {
      padding: 6px 12px;
      border-radius: 4px;
      border: 1px solid var(--divider-color);
      background: var(--card-background-color);
      color: var(--primary-text-color);
      font-size: 0.9em;
      outline: none;
      cursor: pointer;
    }
    .sort-direction {
      min-width: 9.5em;
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
let u = G;
_([
  I({ type: Object })
], u.prototype, "hass");
_([
  I({ type: Boolean })
], u.prototype, "narrow");
_([
  I({ type: Object })
], u.prototype, "panel");
_([
  w()
], u.prototype, "_scanData");
_([
  w()
], u.prototype, "_progress");
_([
  w()
], u.prototype, "_scanning");
_([
  w()
], u.prototype, "_expandedMAC");
_([
  w()
], u.prototype, "_editingRange");
_([
  w()
], u.prototype, "_sortBy");
_([
  w()
], u.prototype, "_sortDirection");
customElements.get("fortag-scanner-panel") || customElements.define("fortag-scanner-panel", u);
export {
  u as FortagPanel
};
