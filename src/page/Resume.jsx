export default function Resume() {
  return (
    <div className="flex flex-col items-start gap-4 w-5xl min-h-screen p-4 border border-solid rounded-lg my-4">
      <h1 className="text-3xl font-bold">Ashutosh Patro</h1>

      <div>
        <div className="flex items-center gap-1">
          <b>Github Link</b>
          <a href="https://github.com/Ashutosh-6603">🔗</a>
        </div>
        <div className="flex items-center gap-1">
          <b>Linkedin Link</b>
          <a href="https://www.linkedin.com/in/ashutosh-patro-1a94272a7/">🔗</a>
        </div>
        <div className="flex items-center gap-1">
          <b>Email: </b>
          <p>ashutosh6603@gmail.com</p>
        </div>
      </div>

      <div className="w-full">
        <h2 className="text-xl font-semibold">Profile Summary</h2>
        <hr className="w-full mt-1" />
      </div>

      <div className="ml-6">
        <ul className="list-disc">
          <li>
            <b>Over 2 years of full stack development experience,&nbsp;</b>
            specializing in building and optimizing scalable web applications
            using React, Next.js, Node.js, and GraphQL, with proven skills in
            modernizing legacy systems to enhance performance and
            maintainability.
          </li>
          <li>
            <b>
              Successfully led multiple projects at Itobuz Technologies,&nbsp;
            </b>
            considerably improving application responsiveness, reducing load
            times, and boosting user engagement through advanced UI/UX
            strategies and state management solutions.
          </li>
          <li>
            <b>
              Showcased strong collaboration and leadership skills by
              working&nbsp;
            </b>
            closely with crossfunctional teams to deliver innovative,
            high-quality software solutions aligned with client requirements and
            industry best practices.
          </li>
          <li>
            <b>
              Proficient in microservices architecture and multiple programming
              languages,&nbsp;
            </b>
            including Node.js and Nest.js, enabling the development of modular,
            maintainable, and scalable applications.
          </li>
          <li>
            <b>
              Committed to continuous professional growth by staying updated
              with&nbsp;
            </b>
            emerging technologies and trends, consistently applying cutting-edge
            solutions to drive efficiency, user satisfaction, and business
            impact.
          </li>
        </ul>
      </div>

      <div className="w-full">
        <h2 className="text-xl font-semibold">Work Experience</h2>
        <hr className="w-full mt-1" />
      </div>

      <div className="bg-gray-200 min-w-full p-1 rounded-md">
        <h3 className="font-bold">Full Stack Software Developer</h3>
        <div>
          <b>Itobuz Technologies, Kolkata</b> | Jul 2023 – Jul 2025
        </div>
      </div>

      <div className="w-full">
        <h2 className="text-xl font-semibold">Projects</h2>
        <hr className="w-full mt-1" />
      </div>

      <div>
        <ul className="flex flex-col gap-4 ml-2">
          <li>
            <div className="font-bold">
              Snap E-Cabs (Electric Vehicle-based Cab Service Company)
            </div>
            <ul className="list-disc ml-4">
              <li>
                Successfully migrated the admin dashboard from PHP to React,
                considerably enhancing maintainability and improving UI
                responsiveness.
              </li>
              <li>
                Integrated Redux Toolkit for efficient state management
                alongside React Hook Form and Zod, ensuring robust and scalable
                form validation.
              </li>
              <li>
                Implemented API response caching, resulting in a 25% reduction
                in server load and a 40% improvement in data retrieval speed.
              </li>
              <li>
                Optimized UI rendering for large datasets, reducing query load
                times from 6 seconds to 2 seconds, enhancing overall user
                experience.
              </li>
            </ul>
          </li>

          <li>
            <div className="font-bold">Jobbora (Job Portal Application)</div>
            <ul className="list-disc ml-4">
              <li>
                Developed a fully responsive job portal from the ground up using
                React, Redux Toolkit, and GraphQL (Apollo), delivering a
                seamless user experience
              </li>
              <li>
                Designed complex, step-wise progressive forms that reduced user
                drop-off rates by 30%, improving lead conversion considerably
              </li>
              <li>
                Utilized useQuery and useMutation hooks to enable efficient and
                effective GraphQL operations.
              </li>
              <li>
                Architected a scalable system facilitating easy future
                enhancements and expansions.
              </li>
            </ul>
          </li>

          <li>
            <div className="font-bold">
              Design-Studio (Lead Generation Platform)
            </div>
            <ul className="list-disc ml-4">
              <li>
                Led UX optimization initiatives that improved conversion rates
                by 15% through strategic enhancements to user flows.
              </li>
              <li>
                Designed a responsive and credible UI, increasing average
                session duration by 20%, thereby enhancing user engagement.
              </li>
              <li>
                Created intelligent form experiences that attracted qualified
                leads while minimizing spam submissions.
              </li>
              <li>
                Website:{" "}
                <a href="https://www.designstudiouiux.com/">
                  https://www.designstudiouiux.com/
                </a>
              </li>
            </ul>
          </li>
        </ul>
      </div>

      <div className="w-full">
        <h2 className="text-xl font-semibold">Internships</h2>
        <hr className="w-full mt-1" />
      </div>

      <div className="bg-gray-200 min-w-full p-1 rounded-md">
        <h3 className="font-bold">Full Stack Software Developer Intern</h3>
        <div>
          <b>Itobuz Technologies, Kolkata</b> | Jan 2023 – Jul 2023
        </div>
      </div>

      <div className="ml-6">
        <ul className="list-disc">
          <li>
            Gained hands-on experience with MERN stack development, contributing
            to the building of full stack web applications.
          </li>
        </ul>
      </div>

      <div className="w-full">
        <h2 className="text-xl font-semibold">Technical Skills</h2>
        <hr className="w-full mt-1" />
      </div>

      <div>
        <ul className="flex flex-col gap-4 ml-2">
          <li>
            <div className="font-bold">Frontend Technologies</div>
            <ul className="list-disc ml-4">
              <li>
                React.js, Next.js, Three.js, A-Frame.js, HTML, CSS, JavaScript
              </li>
            </ul>
          </li>
          <li>
            <div className="font-bold">Backend Technologies</div>
            <ul className="list-disc ml-4">
              <li>
                Node.js, Express.js, Nest.js, REST API, GraphQL, JWT, OAuth2
              </li>
            </ul>
          </li>
          <li>
            <div className="font-bold">Database and ORM</div>
            <ul className="list-disc ml-4">
              <li>PostgreSQL, MongoDB, Prisma, Mongoose</li>
            </ul>
          </li>
          <li>
            <div className="font-bold">Architecture and Design Patterns</div>
            <ul className="list-disc ml-4">
              <li>Microservices, Microfrontends</li>
            </ul>
          </li>
          <li>
            <div className="font-bold">Cloud and Devops</div>
            <ul className="list-disc ml-4">
              <li>AWS, Vercel, CI/CD, Git, GitHub, Bitbucket, Jira</li>
            </ul>
          </li>
        </ul>
      </div>

      <div className="w-full">
        <h2 className="text-xl font-semibold">Awards</h2>
        <hr className="w-full mt-1" />
      </div>

      <div className="ml-6">
        <ul className="list-disc">
          <li>
            <b>Winner</b> —{" "}
            <b>Company Hackathon (Meta Quest 2 VR Game Development)</b>{" "}
            Developed a 3D shooter game using AFrame.js (built on Three.js) for
            the Meta Quest 2 VR platform, securing 1st place among competing
            teams.
          </li>
        </ul>
      </div>

      <div className="w-full">
        <h2 className="text-xl font-semibold">Education</h2>
        <hr className="w-full mt-1" />
      </div>

      <div className="ml-6">
        <ul className="list-disc">
          <li>
            <b>DAV Public School, Pokhariput</b>
            <p>
              10th Standard – CBSE Board, 2017 – <b>10 CGPA</b>
            </p>
          </li>
          <li>
            <b>DAV Public School, Pokhariput</b>
            <p>
              12th Standard – CBSE Board, 2019 – <b>90.8 %</b>
            </p>
          </li>
          <li>
            <b>
              Odisha University of Technology and Research(Formerly College of
              Engineering and Technology)
            </b>
            <p>
              Bachelors of Technology – <b>8.47 CGPA</b>
            </p>
          </li>
        </ul>
      </div>
    </div>
  );
}
