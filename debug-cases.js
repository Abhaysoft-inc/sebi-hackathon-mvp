import { prisma } from '@/lib/prisma'

async function checkCaseStatuses() {
    try {
        const cases = await prisma.caseStudy.findMany({
            select: {
                id: true,
                title: true,
                status: true,
                slug: true
            }
        })

        console.log('Case Studies in database:')
        cases.forEach(cs => {
            console.log(`ID: ${cs.id}, Title: ${cs.title}, Status: ${cs.status}, Slug: ${cs.slug}`)
        })

        return cases
    } catch (error) {
        console.error('Error:', error)
    } finally {
        await prisma.$disconnect()
    }
}

checkCaseStatuses()
