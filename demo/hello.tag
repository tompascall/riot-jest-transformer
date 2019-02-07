<hello>
    <h1>{ opts.name }</h1>

    <script>
        import {foo} from "./foo";

        this.on("mount", () => {
            console.log("mounted " + foo);
        });
    </script>
</hello>
