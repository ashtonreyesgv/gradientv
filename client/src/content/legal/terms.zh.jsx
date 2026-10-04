// 服务条款 (Chinese).
// the text of the old zh/terms.html, moved over word for word. LegalView.jsx draws the page around it
import { Link } from 'react-router';

export const meta = {
    title: '服务条款 - GradientV',
    description: '适用于您使用 GradientV 网站及其中所述服务的条款。',
    label: '法律信息',
    heading: '服务条款',
    updated: '最后更新：2026年9月1日'
};

export default function TermsZh() {
    return (
        <>
            <p>本条款适用于您对 GradientV LLC（以 GradientV 为商号开展经营，以下简称 “GradientV”“我们”）所运营网站的使用。访问并使用本网站，即表示您同意本条款。若您不同意，请勿使用本网站。</p>
            <h2>可接受的使用</h2>
            <p>您同意以合法且尊重他人的方式使用本网站。您同意不会：</p>
            <ul>
                <li>试图干扰本网站或其系统、使其超负荷运行，或未经授权对其进行访问。</li>
                <li>以下文未允许的方式复制、抓取或转载本网站内容。</li>
                <li>利用本网站发送违法、有害或具有误导性的内容。</li>
            </ul>
            <h2>知识产权</h2>
            <p>本网站的内容，包括文字、设计、图形、GradientV 名称及标识，除另有说明外，均归 GradientV LLC 所有。您可以浏览我们的页面并分享指向这些页面的链接，但未经我们书面许可，不得为商业目的重复使用我们的内容。</p>
            <h2>客户合作项目</h2>
            <p>本条款仅适用于本网站。GradientV LLC 与客户之间的任何有偿工作，均由另行签署的《客户服务协议》约束。若该协议与本网站条款存在不一致，就该项合作而言，以已签署的协议为准。</p>
            <h2>保证免责声明</h2>
            <p>本网站按“现状”和“现有可用”的状态提供。我们会努力保持其准确性与可用性，但不保证其没有错误、不会中断或始终为最新。您使用本网站的风险由您自行承担。</p>
            <h2>责任限制</h2>
            <p>在法律允许的最大范围内，对于因您使用或无法使用本网站而产生的任何间接、附带或后果性损害，GradientV LLC 不承担责任。本节涉及的是本网站本身，并不限制已签署的《客户服务协议》中约定的任何义务。</p>
            <h2>适用法律</h2>
            <p>本条款受 New York 州法律管辖，不考虑其法律冲突规则。</p>
            <h2>本条款的变更</h2>
            <p>我们可能会不时更新本条款。更新时，我们会修改上方的“最后更新”日期。条款变更后继续使用本网站，即表示您接受更新后的条款。</p>
            <h2>联系我们</h2>
            <p>如您对本条款有任何疑问，请发送邮件至 <a href="mailto:contact@gradientv.com">contact@gradientv.com</a>，或通过我们的 <Link to="/zh/contact">联系页面</Link>与我们联系。</p>
        </>
    );
}
