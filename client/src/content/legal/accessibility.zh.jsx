// 无障碍声明 (Chinese).
// the text of the old zh/accessibility.html, moved over word for word. LegalView.jsx draws the page around it
import { Link } from 'react-router';

export const meta = {
    title: '无障碍声明 - GradientV',
    description: 'GradientV 无障碍声明：我们建设网站所依据的 WCAG 2.1 AA 级标准、我们持续开展的测试，以及如何向我们反馈您遇到的使用障碍。',
    label: '法律信息',
    heading: '无障碍声明',
    updated: '最后更新：2026年9月1日'
};

export default function AccessibilityZh() {
    return (
        <>
            <p>GradientV LLC（以 GradientV 为商号开展经营）致力于数字无障碍。我们希望尽可能多的人都能使用本网站，包括依赖辅助技术的人士。</p>
            <h2>我们的建设标准</h2>
            <p>我们按照 Web 内容无障碍指南（WCAG）2.1 的 AA 级标准建设本网站。这意味着我们力求做到颜色对比度充分、标题层级清晰、图片配有描述性替代文本，并且内容可通过键盘和屏幕阅读器使用。</p>
            <h2>持续进行的工作</h2>
            <p>无障碍是一项持续进行的工作，而不是一次性的任务。我们使用自动化工具测试本网站，并在发现问题时予以修复。我们清楚自动化工具无法发现所有问题，因此会随着网站的变化持续复查。我们并不声称已获得正式认证或完全符合标准。</p>
            <h2>请告诉我们您遇到的障碍</h2>
            <p>如果您在本网站上遇到任何难以使用或难以阅读的内容，我们希望了解这一情况。请发送邮件至 <a href="mailto:contact@gradientv.com">contact@gradientv.com</a>，或通过我们的<Link to="/zh/contact">联系页面</Link>与我们联系，并请告知我们具体是哪个页面以及发生了什么。我们会尽力修复问题，也会尽力在此期间帮助您获得所需的信息。</p>
        </>
    );
}
