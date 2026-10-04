// 隐私政策 (Chinese).
// the text of the old zh/privacy.html, moved over word for word. LegalView.jsx draws the page around it
import { Link } from 'react-router';

export const meta = {
    title: '隐私政策 - GradientV',
    description: '以通俗易懂的语言说明 GradientV 如何收集、使用和保护通过本网站获取的信息。',
    label: '法律信息',
    heading: '隐私政策',
    updated: '最后更新：2026年9月1日'
};

export default function PrivacyZh() {
    return (
        <>
            <p>GradientV LLC，以 GradientV 为商业名称开展经营，是一家位于 New York 州 New York City 与 Stony Brook 的技术服务公司。本政策说明我们通过本网站收集哪些信息、如何使用这些信息，以及您拥有哪些选择。我们有意让内容保持简短、直白。</p>
            <h2>我们收集的信息</h2>
            <p>我们只收集为回复您并维持网站运行所必需的信息：</p>
            <ul>
                <li><strong>您提供的联系信息。</strong>如果您通过联系表单或电子邮件向我们发送消息，我们会收集您的姓名、电子邮箱地址以及消息内容。</li>
                <li><strong>基本使用数据。</strong>与大多数网站一样，我们的托管服务和分析服务会记录汇总性信息，例如访问的页面、来源网站、浏览器类型、设备类型，以及以国家为单位的大致位置。</li>
                <li><strong>Cookie。</strong>本网站不设置任何 Cookie。请参见下方的 Cookie 部分。</li>
            </ul>
            <h2>我们如何使用您的信息</h2>
            <p>我们将收集到的信息用于：</p>
            <ul>
                <li>回复您的咨询，并就可能的合作进行后续沟通。</li>
                <li>了解网站的使用情况，以便我们加以改进。</li>
                <li>保障网站安全并使其按预期运行。</li>
            </ul>
            <p>我们不向第三方出售您的个人信息。</p>
            <h2>Cookie 与分析服务</h2>
            <p>本网站使用 Vercel Web Analytics 统计总体访问情况，例如某个页面有多少人访问。它是无 Cookie 的：不设置任何 Cookie，不使用浏览器指纹识别，也不会跨其他网站追踪您。它不收集可识别您个人身份的数据，我们也不会用它来建立广告画像。</p>
            <p>由于不涉及任何 Cookie，这里没有需要您接受或拒绝的内容，网站在两种情况下的运行方式完全相同。</p>
            <h2>第三方服务</h2>
            <p>我们依靠少数几家第三方服务商来运营本网站。本网站由 Vercel 托管，上文所述的分析服务也由其提供；我们使用 Google Workspace 收发电子邮件。这些服务商代表我们处理数据，且仅用于本政策所述的目的。我们建议您查阅您所接触的任何服务的隐私保护做法。</p>
            <h2>数据保留</h2>
            <p>我们保留联系消息的时间，仅限于回复您和留存往来记录所需的期限；不再需要时，我们即予以删除。汇总性分析数据可能保留更长时间，因为这些数据无法识别您的个人身份。</p>
            <h2>您的权利</h2>
            <p>您可以要求我们向您展示我们所掌握的有关您的个人信息，也可以要求更正或删除这些信息。如需提出请求，请通过下方的联系方式与我们联系，我们会在合理时间内回复。</p>
            <h2>联系我们</h2>
            <p>如果您对本政策或您的数据有疑问，请发送电子邮件至 <a href="mailto:contact@gradientv.com">contact@gradientv.com</a>，或通过我们的 <Link to="/zh/contact">联系页面</Link>与我们联系。</p>
        </>
    );
}
