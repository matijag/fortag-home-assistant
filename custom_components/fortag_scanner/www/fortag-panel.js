/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const I = globalThis, K = I.ShadowRoot && (I.ShadyCSS === void 0 || I.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, Q = Symbol(), G = /* @__PURE__ */ new WeakMap();
let _t = class {
  constructor(t, e, s) {
    if (this._$cssResult$ = !0, s !== Q) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = e;
  }
  get styleSheet() {
    let t = this.o;
    const e = this.t;
    if (K && t === void 0) {
      const s = e !== void 0 && e.length === 1;
      s && (t = G.get(e)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), s && G.set(e, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const bt = (o) => new _t(typeof o == "string" ? o : o + "", void 0, Q), yt = (o, ...t) => {
  const e = o.length === 1 ? o[0] : t.reduce((s, r, i) => s + ((n) => {
    if (n._$cssResult$ === !0) return n.cssText;
    if (typeof n == "number") return n;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + n + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(r) + o[i + 1], o[0]);
  return new _t(e, o, Q);
}, At = (o, t) => {
  if (K) o.adoptedStyleSheets = t.map((e) => e instanceof CSSStyleSheet ? e : e.styleSheet);
  else for (const e of t) {
    const s = document.createElement("style"), r = I.litNonce;
    r !== void 0 && s.setAttribute("nonce", r), s.textContent = e.cssText, o.appendChild(s);
  }
}, X = K ? (o) => o : (o) => o instanceof CSSStyleSheet ? ((t) => {
  let e = "";
  for (const s of t.cssRules) e += s.cssText;
  return bt(e);
})(o) : o;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: wt, defineProperty: xt, getOwnPropertyDescriptor: St, getOwnPropertyNames: Et, getOwnPropertySymbols: kt, getPrototypeOf: Ct } = Object, v = globalThis, tt = v.trustedTypes, Pt = tt ? tt.emptyScript : "", W = v.reactiveElementPolyfillSupport, P = (o, t) => o, B = { toAttribute(o, t) {
  switch (t) {
    case Boolean:
      o = o ? Pt : null;
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
} }, Y = (o, t) => !wt(o, t), et = { attribute: !0, type: String, converter: B, reflect: !1, useDefault: !1, hasChanged: Y };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), v.litPropertyMetadata ?? (v.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
let S = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ?? (this.l = [])).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, e = et) {
    if (e.state && (e.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((e = Object.create(e)).wrapped = !0), this.elementProperties.set(t, e), !e.noAccessor) {
      const s = Symbol(), r = this.getPropertyDescriptor(t, s, e);
      r !== void 0 && xt(this.prototype, t, r);
    }
  }
  static getPropertyDescriptor(t, e, s) {
    const { get: r, set: i } = St(this.prototype, t) ?? { get() {
      return this[e];
    }, set(n) {
      this[e] = n;
    } };
    return { get: r, set(n) {
      const a = r == null ? void 0 : r.call(this);
      i == null || i.call(this, n), this.requestUpdate(t, a, s);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) ?? et;
  }
  static _$Ei() {
    if (this.hasOwnProperty(P("elementProperties"))) return;
    const t = Ct(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(P("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(P("properties"))) {
      const e = this.properties, s = [...Et(e), ...kt(e)];
      for (const r of s) this.createProperty(r, e[r]);
    }
    const t = this[Symbol.metadata];
    if (t !== null) {
      const e = litPropertyMetadata.get(t);
      if (e !== void 0) for (const [s, r] of e) this.elementProperties.set(s, r);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [e, s] of this.elementProperties) {
      const r = this._$Eu(e, s);
      r !== void 0 && this._$Eh.set(r, e);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(t) {
    const e = [];
    if (Array.isArray(t)) {
      const s = new Set(t.flat(1 / 0).reverse());
      for (const r of s) e.unshift(X(r));
    } else t !== void 0 && e.push(X(t));
    return e;
  }
  static _$Eu(t, e) {
    const s = e.attribute;
    return s === !1 ? void 0 : typeof s == "string" ? s : typeof t == "string" ? t.toLowerCase() : void 0;
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
    for (const s of e.keys()) this.hasOwnProperty(s) && (t.set(s, this[s]), delete this[s]);
    t.size > 0 && (this._$Ep = t);
  }
  createRenderRoot() {
    const t = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return At(t, this.constructor.elementStyles), t;
  }
  connectedCallback() {
    var t;
    this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this.enableUpdating(!0), (t = this._$EO) == null || t.forEach((e) => {
      var s;
      return (s = e.hostConnected) == null ? void 0 : s.call(e);
    });
  }
  enableUpdating(t) {
  }
  disconnectedCallback() {
    var t;
    (t = this._$EO) == null || t.forEach((e) => {
      var s;
      return (s = e.hostDisconnected) == null ? void 0 : s.call(e);
    });
  }
  attributeChangedCallback(t, e, s) {
    this._$AK(t, s);
  }
  _$ET(t, e) {
    var i;
    const s = this.constructor.elementProperties.get(t), r = this.constructor._$Eu(t, s);
    if (r !== void 0 && s.reflect === !0) {
      const n = (((i = s.converter) == null ? void 0 : i.toAttribute) !== void 0 ? s.converter : B).toAttribute(e, s.type);
      this._$Em = t, n == null ? this.removeAttribute(r) : this.setAttribute(r, n), this._$Em = null;
    }
  }
  _$AK(t, e) {
    var i, n;
    const s = this.constructor, r = s._$Eh.get(t);
    if (r !== void 0 && this._$Em !== r) {
      const a = s.getPropertyOptions(r), c = typeof a.converter == "function" ? { fromAttribute: a.converter } : ((i = a.converter) == null ? void 0 : i.fromAttribute) !== void 0 ? a.converter : B;
      this._$Em = r;
      const d = c.fromAttribute(e, a.type);
      this[r] = d ?? ((n = this._$Ej) == null ? void 0 : n.get(r)) ?? d, this._$Em = null;
    }
  }
  requestUpdate(t, e, s, r = !1, i) {
    var n;
    if (t !== void 0) {
      const a = this.constructor;
      if (r === !1 && (i = this[t]), s ?? (s = a.getPropertyOptions(t)), !((s.hasChanged ?? Y)(i, e) || s.useDefault && s.reflect && i === ((n = this._$Ej) == null ? void 0 : n.get(t)) && !this.hasAttribute(a._$Eu(t, s)))) return;
      this.C(t, e, s);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(t, e, { useDefault: s, reflect: r, wrapped: i }, n) {
    s && !(this._$Ej ?? (this._$Ej = /* @__PURE__ */ new Map())).has(t) && (this._$Ej.set(t, n ?? e ?? this[t]), i !== !0 || n !== void 0) || (this._$AL.has(t) || (this.hasUpdated || s || (e = void 0), this._$AL.set(t, e)), r === !0 && this._$Em !== t && (this._$Eq ?? (this._$Eq = /* @__PURE__ */ new Set())).add(t));
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
    var s;
    if (!this.isUpdatePending) return;
    if (!this.hasUpdated) {
      if (this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this._$Ep) {
        for (const [i, n] of this._$Ep) this[i] = n;
        this._$Ep = void 0;
      }
      const r = this.constructor.elementProperties;
      if (r.size > 0) for (const [i, n] of r) {
        const { wrapped: a } = n, c = this[i];
        a !== !0 || this._$AL.has(i) || c === void 0 || this.C(i, void 0, n, c);
      }
    }
    let t = !1;
    const e = this._$AL;
    try {
      t = this.shouldUpdate(e), t ? (this.willUpdate(e), (s = this._$EO) == null || s.forEach((r) => {
        var i;
        return (i = r.hostUpdate) == null ? void 0 : i.call(r);
      }), this.update(e)) : this._$EM();
    } catch (r) {
      throw t = !1, this._$EM(), r;
    }
    t && this._$AE(e);
  }
  willUpdate(t) {
  }
  _$AE(t) {
    var e;
    (e = this._$EO) == null || e.forEach((s) => {
      var r;
      return (r = s.hostUpdated) == null ? void 0 : r.call(s);
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
S.elementStyles = [], S.shadowRootOptions = { mode: "open" }, S[P("elementProperties")] = /* @__PURE__ */ new Map(), S[P("finalized")] = /* @__PURE__ */ new Map(), W == null || W({ ReactiveElement: S }), (v.reactiveElementVersions ?? (v.reactiveElementVersions = [])).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const O = globalThis, st = (o) => o, z = O.trustedTypes, rt = z ? z.createPolicy("lit-html", { createHTML: (o) => o }) : void 0, ft = "$lit$", m = `lit$${Math.random().toFixed(9).slice(2)}$`, $t = "?" + m, Ot = `<${$t}>`, x = document, H = () => x.createComment(""), R = (o) => o === null || typeof o != "object" && typeof o != "function", Z = Array.isArray, Nt = (o) => Z(o) || typeof (o == null ? void 0 : o[Symbol.iterator]) == "function", F = `[ 	
\f\r]`, C = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, it = /-->/g, nt = />/g, y = RegExp(`>|${F}(?:([^\\s"'>=/]+)(${F}*=${F}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), ot = /'/g, at = /"/g, mt = /^(?:script|style|textarea|title)$/i, Ht = (o) => (t, ...e) => ({ _$litType$: o, strings: t, values: e }), u = Ht(1), E = Symbol.for("lit-noChange"), p = Symbol.for("lit-nothing"), ct = /* @__PURE__ */ new WeakMap(), A = x.createTreeWalker(x, 129);
function vt(o, t) {
  if (!Z(o) || !o.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return rt !== void 0 ? rt.createHTML(t) : t;
}
const Rt = (o, t) => {
  const e = o.length - 1, s = [];
  let r, i = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", n = C;
  for (let a = 0; a < e; a++) {
    const c = o[a];
    let d, h, l = -1, f = 0;
    for (; f < c.length && (n.lastIndex = f, h = n.exec(c), h !== null); ) f = n.lastIndex, n === C ? h[1] === "!--" ? n = it : h[1] !== void 0 ? n = nt : h[2] !== void 0 ? (mt.test(h[2]) && (r = RegExp("</" + h[2], "g")), n = y) : h[3] !== void 0 && (n = y) : n === y ? h[0] === ">" ? (n = r ?? C, l = -1) : h[1] === void 0 ? l = -2 : (l = n.lastIndex - h[2].length, d = h[1], n = h[3] === void 0 ? y : h[3] === '"' ? at : ot) : n === at || n === ot ? n = y : n === it || n === nt ? n = C : (n = y, r = void 0);
    const $ = n === y && o[a + 1].startsWith("/>") ? " " : "";
    i += n === C ? c + Ot : l >= 0 ? (s.push(d), c.slice(0, l) + ft + c.slice(l) + m + $) : c + m + (l === -2 ? a : $);
  }
  return [vt(o, i + (o[e] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), s];
};
class U {
  constructor({ strings: t, _$litType$: e }, s) {
    let r;
    this.parts = [];
    let i = 0, n = 0;
    const a = t.length - 1, c = this.parts, [d, h] = Rt(t, e);
    if (this.el = U.createElement(d, s), A.currentNode = this.el.content, e === 2 || e === 3) {
      const l = this.el.content.firstChild;
      l.replaceWith(...l.childNodes);
    }
    for (; (r = A.nextNode()) !== null && c.length < a; ) {
      if (r.nodeType === 1) {
        if (r.hasAttributes()) for (const l of r.getAttributeNames()) if (l.endsWith(ft)) {
          const f = h[n++], $ = r.getAttribute(l).split(m), T = /([.?@])?(.*)/.exec(f);
          c.push({ type: 1, index: i, name: T[2], strings: $, ctor: T[1] === "." ? Mt : T[1] === "?" ? Tt : T[1] === "@" ? Dt : j }), r.removeAttribute(l);
        } else l.startsWith(m) && (c.push({ type: 6, index: i }), r.removeAttribute(l));
        if (mt.test(r.tagName)) {
          const l = r.textContent.split(m), f = l.length - 1;
          if (f > 0) {
            r.textContent = z ? z.emptyScript : "";
            for (let $ = 0; $ < f; $++) r.append(l[$], H()), A.nextNode(), c.push({ type: 2, index: ++i });
            r.append(l[f], H());
          }
        }
      } else if (r.nodeType === 8) if (r.data === $t) c.push({ type: 2, index: i });
      else {
        let l = -1;
        for (; (l = r.data.indexOf(m, l + 1)) !== -1; ) c.push({ type: 7, index: i }), l += m.length - 1;
      }
      i++;
    }
  }
  static createElement(t, e) {
    const s = x.createElement("template");
    return s.innerHTML = t, s;
  }
}
function k(o, t, e = o, s) {
  var n, a;
  if (t === E) return t;
  let r = s !== void 0 ? (n = e._$Co) == null ? void 0 : n[s] : e._$Cl;
  const i = R(t) ? void 0 : t._$litDirective$;
  return (r == null ? void 0 : r.constructor) !== i && ((a = r == null ? void 0 : r._$AO) == null || a.call(r, !1), i === void 0 ? r = void 0 : (r = new i(o), r._$AT(o, e, s)), s !== void 0 ? (e._$Co ?? (e._$Co = []))[s] = r : e._$Cl = r), r !== void 0 && (t = k(o, r._$AS(o, t.values), r, s)), t;
}
class Ut {
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
    const { el: { content: e }, parts: s } = this._$AD, r = ((t == null ? void 0 : t.creationScope) ?? x).importNode(e, !0);
    A.currentNode = r;
    let i = A.nextNode(), n = 0, a = 0, c = s[0];
    for (; c !== void 0; ) {
      if (n === c.index) {
        let d;
        c.type === 2 ? d = new M(i, i.nextSibling, this, t) : c.type === 1 ? d = new c.ctor(i, c.name, c.strings, this, t) : c.type === 6 && (d = new It(i, this, t)), this._$AV.push(d), c = s[++a];
      }
      n !== (c == null ? void 0 : c.index) && (i = A.nextNode(), n++);
    }
    return A.currentNode = x, r;
  }
  p(t) {
    let e = 0;
    for (const s of this._$AV) s !== void 0 && (s.strings !== void 0 ? (s._$AI(t, s, e), e += s.strings.length - 2) : s._$AI(t[e])), e++;
  }
}
class M {
  get _$AU() {
    var t;
    return ((t = this._$AM) == null ? void 0 : t._$AU) ?? this._$Cv;
  }
  constructor(t, e, s, r) {
    this.type = 2, this._$AH = p, this._$AN = void 0, this._$AA = t, this._$AB = e, this._$AM = s, this.options = r, this._$Cv = (r == null ? void 0 : r.isConnected) ?? !0;
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
    t = k(this, t, e), R(t) ? t === p || t == null || t === "" ? (this._$AH !== p && this._$AR(), this._$AH = p) : t !== this._$AH && t !== E && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : Nt(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== p && R(this._$AH) ? this._$AA.nextSibling.data = t : this.T(x.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    var i;
    const { values: e, _$litType$: s } = t, r = typeof s == "number" ? this._$AC(t) : (s.el === void 0 && (s.el = U.createElement(vt(s.h, s.h[0]), this.options)), s);
    if (((i = this._$AH) == null ? void 0 : i._$AD) === r) this._$AH.p(e);
    else {
      const n = new Ut(r, this), a = n.u(this.options);
      n.p(e), this.T(a), this._$AH = n;
    }
  }
  _$AC(t) {
    let e = ct.get(t.strings);
    return e === void 0 && ct.set(t.strings, e = new U(t)), e;
  }
  k(t) {
    Z(this._$AH) || (this._$AH = [], this._$AR());
    const e = this._$AH;
    let s, r = 0;
    for (const i of t) r === e.length ? e.push(s = new M(this.O(H()), this.O(H()), this, this.options)) : s = e[r], s._$AI(i), r++;
    r < e.length && (this._$AR(s && s._$AB.nextSibling, r), e.length = r);
  }
  _$AR(t = this._$AA.nextSibling, e) {
    var s;
    for ((s = this._$AP) == null ? void 0 : s.call(this, !1, !0, e); t !== this._$AB; ) {
      const r = st(t).nextSibling;
      st(t).remove(), t = r;
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
  constructor(t, e, s, r, i) {
    this.type = 1, this._$AH = p, this._$AN = void 0, this.element = t, this.name = e, this._$AM = r, this.options = i, s.length > 2 || s[0] !== "" || s[1] !== "" ? (this._$AH = Array(s.length - 1).fill(new String()), this.strings = s) : this._$AH = p;
  }
  _$AI(t, e = this, s, r) {
    const i = this.strings;
    let n = !1;
    if (i === void 0) t = k(this, t, e, 0), n = !R(t) || t !== this._$AH && t !== E, n && (this._$AH = t);
    else {
      const a = t;
      let c, d;
      for (t = i[0], c = 0; c < i.length - 1; c++) d = k(this, a[s + c], e, c), d === E && (d = this._$AH[c]), n || (n = !R(d) || d !== this._$AH[c]), d === p ? t = p : t !== p && (t += (d ?? "") + i[c + 1]), this._$AH[c] = d;
    }
    n && !r && this.j(t);
  }
  j(t) {
    t === p ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class Mt extends j {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === p ? void 0 : t;
  }
}
class Tt extends j {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== p);
  }
}
class Dt extends j {
  constructor(t, e, s, r, i) {
    super(t, e, s, r, i), this.type = 5;
  }
  _$AI(t, e = this) {
    if ((t = k(this, t, e, 0) ?? p) === E) return;
    const s = this._$AH, r = t === p && s !== p || t.capture !== s.capture || t.once !== s.once || t.passive !== s.passive, i = t !== p && (s === p || r);
    r && this.element.removeEventListener(this.name, this, s), i && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    var e;
    typeof this._$AH == "function" ? this._$AH.call(((e = this.options) == null ? void 0 : e.host) ?? this.element, t) : this._$AH.handleEvent(t);
  }
}
class It {
  constructor(t, e, s) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = e, this.options = s;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    k(this, t);
  }
}
const q = O.litHtmlPolyfillSupport;
q == null || q(U, M), (O.litHtmlVersions ?? (O.litHtmlVersions = [])).push("3.3.3");
const Bt = (o, t, e) => {
  const s = (e == null ? void 0 : e.renderBefore) ?? t;
  let r = s._$litPart$;
  if (r === void 0) {
    const i = (e == null ? void 0 : e.renderBefore) ?? null;
    s._$litPart$ = r = new M(t.insertBefore(H(), i), i, void 0, e ?? {});
  }
  return r._$AI(o), r;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const w = globalThis;
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
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = Bt(e, this.renderRoot, this.renderOptions);
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
var gt;
N._$litElement$ = !0, N.finalized = !0, (gt = w.litElementHydrateSupport) == null || gt.call(w, { LitElement: N });
const V = w.litElementPolyfillSupport;
V == null || V({ LitElement: N });
(w.litElementVersions ?? (w.litElementVersions = [])).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const zt = { attribute: !0, type: String, converter: B, reflect: !1, hasChanged: Y }, jt = (o = zt, t, e) => {
  const { kind: s, metadata: r } = e;
  let i = globalThis.litPropertyMetadata.get(r);
  if (i === void 0 && globalThis.litPropertyMetadata.set(r, i = /* @__PURE__ */ new Map()), s === "setter" && ((o = Object.create(o)).wrapped = !0), i.set(e.name, o), s === "accessor") {
    const { name: n } = e;
    return { set(a) {
      const c = t.get.call(this);
      t.set.call(this, a), this.requestUpdate(n, c, o, !0, a);
    }, init(a) {
      return a !== void 0 && this.C(n, void 0, o, a), a;
    } };
  }
  if (s === "setter") {
    const { name: n } = e;
    return function(a) {
      const c = this[n];
      t.call(this, a), this.requestUpdate(n, c, o, !0, a);
    };
  }
  throw Error("Unsupported decorator location: " + s);
};
function L(o) {
  return (t, e) => typeof e == "object" ? jt(o, t, e) : ((s, r, i) => {
    const n = r.hasOwnProperty(i);
    return r.constructor.createProperty(i, s), n ? Object.getOwnPropertyDescriptor(r, i) : void 0;
  })(o, t, e);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function b(o) {
  return L({ ...o, state: !0, attribute: !1 });
}
var Lt = Object.defineProperty, _ = (o, t, e, s) => {
  for (var r = void 0, i = o.length - 1, n; i >= 0; i--)
    (n = o[i]) && (r = n(t, e, r) || r);
  return r && Lt(t, e, r), r;
};
const lt = "fortag.sortField", dt = "fortag.sortDirection", ht = "fortag.currentHostsOnly", pt = "1.0.1b4", ut = 1, D = "1.0.17-rc.2", J = class J extends N {
  constructor() {
    super(...arguments), this.narrow = !1, this._scanData = null, this._progress = { status: "idle", target: "" }, this._scanning = !1, this._expandedMAC = null, this._editingRange = !1, this._sortBy = "ip", this._sortDirection = "asc", this._currentHostsOnly = !0;
  }
  async connectedCallback() {
    super.connectedCallback(), this._loadPreferences(), this._fetchData(), setInterval(() => this._fetchData(), 1e4);
  }
  _loadPreferences() {
    try {
      const t = localStorage.getItem(lt);
      (t === "name" || t === "ip" || t === "first_seen" || t === "last_seen") && (this._sortBy = t);
      const e = localStorage.getItem(dt);
      (e === "asc" || e === "desc") && (this._sortDirection = e);
      const s = localStorage.getItem(ht);
      s !== null && (this._currentHostsOnly = s === "true");
    } catch (t) {
      console.warn("Could not load Fortag panel preferences", t);
    }
  }
  _savePreference(t, e) {
    try {
      localStorage.setItem(t, e);
    } catch (s) {
      console.warn("Could not save Fortag panel preference", s);
    }
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
    var s;
    const t = (s = this.shadowRoot) == null ? void 0 : s.querySelector(".range-input"), e = t == null ? void 0 : t.value;
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
    const s = prompt("Enter a new name for this device:", e || "");
    if (!(s === null || s === e))
      try {
        await this.hass.callWS({
          type: "fortag_scanner/rename",
          mac: t,
          name: s
        }), this._scanData && this._scanData.hosts && (this._scanData.hosts = this._scanData.hosts.map((r) => r.mac === t ? { ...r, custom_name: s, is_acknowledged: !0 } : r), this.requestUpdate());
      } catch (r) {
        console.error("Failed to rename host", r);
      }
  }
  async _acknowledge(t, e, s) {
    try {
      await this.hass.callWS({
        type: "fortag_scanner/acknowledge",
        mac: t,
        port: e,
        protocol: s
      }), this._scanData && this._scanData.hosts && (this._scanData.hosts = this._scanData.hosts.map((r) => r.mac === t ? e ? { ...r, ports: r.ports.map((i) => i.port === e && i.protocol === s ? { ...i, is_acknowledged: !0 } : i) } : { ...r, is_acknowledged: !0 } : r), this.requestUpdate());
    } catch (r) {
      console.error("Failed to acknowledge", r);
    }
  }
  _handleSortChange(t) {
    const e = t.target;
    this._sortBy = e.value, this._savePreference(lt, this._sortBy);
  }
  _toggleSortDirection() {
    this._sortDirection = this._sortDirection === "asc" ? "desc" : "asc", this._savePreference(dt, this._sortDirection);
  }
  _toggleCurrentHosts() {
    this._currentHostsOnly = !this._currentHostsOnly, this._savePreference(ht, String(this._currentHostsOnly));
  }
  _compareIPs(t, e) {
    const s = t.split(".").map(Number), r = e.split(".").map(Number);
    for (let i = 0; i < 4; i++) {
      const n = (s[i] || 0) - (r[i] || 0);
      if (n !== 0) return n;
    }
    return 0;
  }
  _sortHosts(t) {
    const e = this._sortDirection === "asc" ? 1 : -1;
    return [...t].sort((s, r) => {
      let i = "", n = "", a = 0;
      return this._sortBy === "name" ? (i = s.custom_name || s.hostname || "Unknown", n = r.custom_name || r.hostname || "Unknown", a = i.localeCompare(n, void 0, { sensitivity: "base", numeric: !0 })) : this._sortBy === "ip" ? (i = s.ip || "", n = r.ip || "", a = this._compareIPs(i, n)) : this._sortBy === "first_seen" ? (i = s.created_at || "", n = r.created_at || "", a = i.localeCompare(n)) : (i = s.last_seen || "", n = r.last_seen || "", a = i.localeCompare(n)), !i && n ? 1 : i && !n ? -1 : a !== 0 ? a * e : this._compareIPs(s.ip || "", r.ip || "");
    });
  }
  _compareScannerVersions(t, e) {
    const s = /^(\d+)\.(\d+)\.(\d+)(?:-(alpha|beta|rc)\.(\d+))?$/, r = t.match(s), i = e.match(s);
    if (!r || !i) return null;
    for (let h = 1; h <= 3; h++) {
      const l = Number(r[h]) - Number(i[h]);
      if (l !== 0) return l;
    }
    const n = { alpha: 0, beta: 1, rc: 2 }, a = r[4], c = i[4];
    if (!a && !c) return 0;
    if (!a) return 1;
    if (!c) return -1;
    const d = n[a] - n[c];
    return d !== 0 ? d : Number(r[5]) - Number(i[5]);
  }
  _compatibilityWarnings(t) {
    if (!t) return [];
    const e = [];
    t.api_version !== ut && e.push(
      `MQTT API v${t.api_version ?? "unknown"} is not supported; this frontend requires v${ut}.`
    ), (Array.isArray(t.hosts) ? t.hosts : []).some((i) => !Object.prototype.hasOwnProperty.call(i, "is_current")) && e.push("The scanner state lacks current-host information, so the current-host filter is unavailable.");
    const r = t.scanner_version;
    if (!r)
      e.push(`Scanner version is missing; version ${D} or newer is required.`);
    else {
      const i = this._compareScannerVersions(r, D);
      i === null ? e.push(`Scanner version '${r}' could not be verified; ${D} or newer is required.`) : i < 0 && e.push(`Scanner ${r} is too old; upgrade to ${D} or newer.`);
    }
    return e;
  }
  render() {
    const t = this._scanData, e = this._progress, s = (t == null ? void 0 : t.hosts) || [], r = this._currentHostsOnly ? s.filter((a) => a.is_current !== !1) : s, i = this._sortHosts(r), n = this._compatibilityWarnings(t);
    return u`
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

      ${n.length ? u`
        <div class="compatibility-warning" role="alert">
          <strong>Fortag compatibility warning</strong>
          <div>Frontend ${pt} detected scanner ${(t == null ? void 0 : t.scanner_version) || "unknown"} with MQTT API v${(t == null ? void 0 : t.api_version) ?? "unknown"}.</div>
          <ul>
            ${n.map((a) => u`<li>${a}</li>`)}
          </ul>
        </div>
      ` : ""}

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
          <div class="value">${(t == null ? void 0 : t.scanner_version) || "Unknown"} · MQTT API v${(t == null ? void 0 : t.api_version) ?? "?"} · Frontend ${pt}</div>
        </div>
      </div>

      <div class="controls-bar">
          <button
            class="action-btn host-scope"
            @click="${this._toggleCurrentHosts}"
            title="Switch between hosts identified in the latest scan and all known hosts"
            aria-pressed="${this._currentHostsOnly}">
            ${this._currentHostsOnly ? `Current hosts (${i.length})` : `All known hosts (${i.length})`}
          </button>
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
          ${i.map((a) => {
      var c, d, h;
      return u`
            <tr>
              <td>${a.ip}</td>
              <td><code>${a.mac}</code></td>
              <td>
                <div style="display: flex; flex-direction: column;">
                  <div>
                    ${!a.is_acknowledged && a.is_new_host ? u`
                        <span class="badge badge-new">NEW HOST</span>
                        <button class="ack-btn" @click="${() => this._acknowledge(a.mac)}">ACK</button>
                    ` : ""}
                    ${a.is_randomized ? u`<span class="badge badge-random">RANDOM MAC</span>` : ""}
                  </div>
                  <strong>${a.custom_name || a.hostname || "Unknown"}</strong>
                  <div style="font-size: 0.85em; color: var(--secondary-text-color); margin-top: 4px; line-height: 1.3;">
                    First seen: ${a.created_at || "N/A"}<br>
                    Last seen: ${a.last_seen || "N/A"}
                  </div>
                </div>
              </td>
              <td>${a.os || "Unknown"}</td>
              <td>
                ${(c = a.ports) == null ? void 0 : c.map((l) => u`
                  <div style="display: flex; align-items: center; gap: 4px; margin-bottom: 2px;">
                    ${!l.is_acknowledged && l.is_new ? u`<span style="color: var(--error-color); font-weight: bold;">[NEW]</span>` : ""}
                    ${l.port}/${l.protocol} (${l.service})
                    ${!l.is_acknowledged && l.is_new ? u`
                        <button class="ack-btn" @click="${() => this._acknowledge(a.mac, l.port, l.protocol)}">ACK</button>
                    ` : ""}
                  </div>
                `)}
              </td>
              <td>
                <button class="action-btn" @click="${() => this._toggleExpand(a.mac)}">
                  ${this._expandedMAC === a.mac ? "Hide Details" : "Details"}
                </button>
                <button class="action-btn" @click="${() => this._renameHost(a.mac, a.custom_name || a.hostname)}">
                  Rename
                </button>
              </td>
            </tr>
            ${this._expandedMAC === a.mac ? u`
              <tr class="details-row">
                <td colspan="6">
                  <div class="details-container">
                    <strong>Extended Analysis for ${a.mac}:</strong>
                    <div class="details-content">
${(d = a.ports) == null ? void 0 : d.filter((l) => l.scripts).map((l) => u`
[Port ${l.port}/${l.protocol}]
${l.scripts}
`)}
${(h = a.ports) != null && h.some((l) => l.scripts) ? "" : "No extended script data available."}
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
J.styles = yt`
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
    .compatibility-warning {
      background: var(--warning-color);
      color: var(--text-primary-color, #111);
      padding: 12px 16px;
      border-radius: 8px;
      margin-bottom: 16px;
      line-height: 1.4;
    }
    .compatibility-warning strong {
      display: block;
      margin-bottom: 4px;
    }
    .compatibility-warning ul {
      margin: 4px 0 0;
      padding-left: 20px;
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
    .host-scope {
      min-width: 12em;
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
let g = J;
_([
  L({ type: Object })
], g.prototype, "hass");
_([
  L({ type: Boolean })
], g.prototype, "narrow");
_([
  L({ type: Object })
], g.prototype, "panel");
_([
  b()
], g.prototype, "_scanData");
_([
  b()
], g.prototype, "_progress");
_([
  b()
], g.prototype, "_scanning");
_([
  b()
], g.prototype, "_expandedMAC");
_([
  b()
], g.prototype, "_editingRange");
_([
  b()
], g.prototype, "_sortBy");
_([
  b()
], g.prototype, "_sortDirection");
_([
  b()
], g.prototype, "_currentHostsOnly");
customElements.get("fortag-scanner-panel") || customElements.define("fortag-scanner-panel", g);
export {
  g as FortagPanel
};
